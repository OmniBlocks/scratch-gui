import BlockInstance from "../find-bar/blockly/BlockInstance.js";
import Utils from "../find-bar/blockly/Utils.js";
import { createEditorModal } from "../../modal.js";

export default class BroadcastTree {
  constructor(addon, msg) {
    this.addon = addon;
    this.msg = msg;
    this.vm = this.addon.tab.traps.vm;
    this.utils = new Utils(addon);
  }

  /**
   * Extract broadcast ID from a block
   * @param {Object} block - The Blockly block
   * @returns {string|null} - The broadcast ID or null if not found
   */
  getBroadcastId(block) {
    try {
      if (block.type === "event_whenbroadcastreceived") {
        return block.getField("BROADCAST_OPTION").getValue();
      } else if (block.type === "event_broadcast" || block.type === "event_broadcastandwait") {
        const input = block.getInput("BROADCAST_INPUT");
        if (input && input.connection && input.connection.targetBlock()) {
          const targetBlock = input.connection.targetBlock();
          if (targetBlock.type === "event_broadcast_menu") {
            return targetBlock.getField("BROADCAST_OPTION").getValue();
          }
        }
      }
    } catch (e) {
      console.warn("Error getting broadcast ID:", e);
    }
    return null;
  }

  /**
   * Get all senders and receivers for a broadcast ID
   * @param {string} broadcastId - The broadcast ID to search for
   * @returns {Object} - Object with senders and receivers arrays
   */
  getSendersAndReceivers(broadcastId) {
    const senders = [];
    const receivers = [];

    for (const target of this.vm.runtime.targets) {
      if (!target.isOriginal) continue;

      for (const blockId of Object.keys(target.blocks._blocks)) {
        const block = target.blocks._blocks[blockId];
        
        // Check for receivers
        if (block.opcode === "event_whenbroadcastreceived" && 
            block.fields.BROADCAST_OPTION && 
            block.fields.BROADCAST_OPTION.id === broadcastId) {
          receivers.push(new BlockInstance(target, block));
        }
        
        // Check for senders
        if ((block.opcode === "event_broadcast" || block.opcode === "event_broadcastandwait") &&
            block.inputs.BROADCAST_INPUT) {
          const input = block.inputs.BROADCAST_INPUT;
          if (input.block === input.shadow) {
            const shadowBlock = target.blocks._blocks[input.shadow];
            if (shadowBlock && shadowBlock.fields.BROADCAST_OPTION && 
                shadowBlock.fields.BROADCAST_OPTION.id === broadcastId) {
              senders.push(new BlockInstance(target, block));
            }
          }
        }
      }
    }

    return { senders, receivers };
  }

  /**
   * Get the broadcast name from ID
   * @param {string} broadcastId - The broadcast ID
   * @returns {string} - The broadcast name
   */
  getBroadcastName(broadcastId) {
    try {
      // Try to get the broadcast name from the variable map
      const stage = this.vm.runtime.getTargetForStage();
      if (stage && stage.variables) {
        for (const variable of Object.values(stage.variables)) {
          if (variable.id === broadcastId && variable.type === "broadcast_msg") {
            return variable.name;
          }
        }
      }
      
      // Fallback: try to find it in any target
      for (const target of this.vm.runtime.targets) {
        if (target.variables) {
          for (const variable of Object.values(target.variables)) {
            if (variable.id === broadcastId && variable.type === "broadcast_msg") {
              return variable.name;
            }
          }
        }
      }
      
      return "Unknown Broadcast";
    } catch (e) {
      console.warn("Error getting broadcast name:", e);
      return "Unknown Broadcast";
    }
  }

  /**
   * Show the broadcast tree modal
   * @param {Object} block - The clicked block
   */
  showBroadcastTree(block) {
    const broadcastId = this.getBroadcastId(block);
    if (!broadcastId) {
      console.warn("Could not find broadcast ID for block");
      return;
    }

    const broadcastName = this.getBroadcastName(broadcastId);
    const { senders, receivers } = this.getSendersAndReceivers(broadcastId);

    // Create modal
    const modal = createEditorModal(this.addon.tab, this.msg("broadcast-tree-title", { name: broadcastName }));
    
    // Build tree content
    this.buildTreeContent(modal.content, senders, receivers, () => modal.remove());

    // Show modal
    modal.open();

    // Close modal on backdrop click or close button
    modal.backdrop.addEventListener("click", () => modal.remove());
    modal.closeButton.addEventListener("click", () => modal.remove());
  }

  /**
   * Build the tree content in the modal
   * @param {HTMLElement} container - The modal content container
   * @param {Array} senders - Array of sender BlockInstance objects
   * @param {Array} receivers - Array of receiver BlockInstance objects
   * @param {Function} closeModal - Function to close the modal
   */
  buildTreeContent(container, senders, receivers, closeModal) {
    container.className += " sa-broadcast-tree-content";

    // Group by sprite
    const sendersBySprite = this.groupBySprite(senders);
    const receiversBySprite = this.groupBySprite(receivers);

    // Create senders section
    this.createSection(container, this.msg("senders"), sendersBySprite, "sender", closeModal);

    // Create receivers section
    this.createSection(container, this.msg("receivers"), receiversBySprite, "receiver", closeModal);
  }

  /**
   * Group blocks by sprite
   * @param {Array} blocks - Array of BlockInstance objects
   * @returns {Object} - Object with sprite names as keys and arrays of blocks as values
   */
  groupBySprite(blocks) {
    const grouped = {};
    
    for (const blockInstance of blocks) {
      const target = this.vm.runtime.getTargetById(blockInstance.targetId);
      if (!target) continue;
      
      const spriteName = target.isStage ? this.msg("sprite-stage") : target.getName();
      
      if (!grouped[spriteName]) {
        grouped[spriteName] = [];
      }
      grouped[spriteName].push(blockInstance);
    }
    
    return grouped;
  }

  /**
   * Create a section (senders or receivers) in the tree
   * @param {HTMLElement} container - The container to add the section to
   * @param {string} title - The section title
   * @param {Object} blocksBySprite - Blocks grouped by sprite
   * @param {string} type - "sender" or "receiver"
   * @param {Function} closeModal - Function to close the modal
   */
  createSection(container, title, blocksBySprite, type, closeModal) {
    const section = document.createElement("div");
    section.className = "sa-broadcast-tree-section";
    
    const header = document.createElement("h3");
    header.className = "sa-broadcast-tree-section-header";
    header.textContent = title;
    section.appendChild(header);

    const spriteNames = Object.keys(blocksBySprite).sort();
    
    if (spriteNames.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "sa-broadcast-tree-empty";
      emptyMsg.textContent = type === "sender" ? this.msg("no-senders") : this.msg("no-receivers");
      section.appendChild(emptyMsg);
    } else {
      for (const spriteName of spriteNames) {
        const spriteSection = this.createSpriteSection(spriteName, blocksBySprite[spriteName], type, closeModal);
        section.appendChild(spriteSection);
      }
    }

    container.appendChild(section);
  }

  /**
   * Create a sprite section with its blocks
   * @param {string} spriteName - The name of the sprite
   * @param {Array} blocks - Array of BlockInstance objects for this sprite
   * @param {string} type - "sender" or "receiver"
   * @param {Function} closeModal - Function to close the modal
   * @returns {HTMLElement} - The sprite section element
   */
  createSpriteSection(spriteName, blocks, type, closeModal) {
    const spriteSection = document.createElement("div");
    spriteSection.className = "sa-broadcast-tree-sprite";

    const spriteHeader = document.createElement("div");
    spriteHeader.className = "sa-broadcast-tree-sprite-header";
    spriteHeader.innerHTML = `
      <span class="sa-broadcast-tree-sprite-icon ${type === "sender" ? "sa-broadcast-icon" : "sa-receive-icon"}"></span>
      <span class="sa-broadcast-tree-sprite-name">${spriteName}</span>
      <span class="sa-broadcast-tree-block-count">(${blocks.length})</span>
    `;
    spriteSection.appendChild(spriteHeader);

    const blockList = document.createElement("div");
    blockList.className = "sa-broadcast-tree-block-list";

    for (const blockInstance of blocks) {
      const blockItem = this.createBlockItem(blockInstance, type, closeModal);
      blockList.appendChild(blockItem);
    }

    spriteSection.appendChild(blockList);
    return spriteSection;
  }

  /**
   * Create a clickable block item
   * @param {BlockInstance} blockInstance - The block instance
   * @param {string} type - "sender" or "receiver"
   * @param {Function} closeModal - Function to close the modal
   * @returns {HTMLElement} - The block item element
   */
  createBlockItem(blockInstance, type, closeModal) {
    const blockItem = document.createElement("div");
    blockItem.className = `sa-broadcast-tree-block-item sa-broadcast-tree-${type}`;
    
    const target = this.vm.runtime.getTargetById(blockInstance.targetId);
    const block = target ? target.blocks._blocks[blockInstance.id] : null;
    
    let blockText = "Unknown Block";
    if (block) {
      if (block.opcode === "event_whenbroadcastreceived") {
        blockText = "when I receive";
      } else if (block.opcode === "event_broadcast") {
        blockText = "broadcast";
      } else if (block.opcode === "event_broadcastandwait") {
        blockText = "broadcast and wait";
      }
    }

    blockItem.innerHTML = `
      <span class="sa-broadcast-tree-block-icon ${type === "sender" ? "sa-broadcast-icon" : "sa-receive-icon"}"></span>
      <span class="sa-broadcast-tree-block-text">${blockText}</span>
    `;

    // Add click handler to navigate to block
    blockItem.addEventListener("click", () => {
      this.utils.scrollBlockIntoView(blockInstance);
      // Close modal after navigation
      closeModal();
    });

    return blockItem;
  }
}