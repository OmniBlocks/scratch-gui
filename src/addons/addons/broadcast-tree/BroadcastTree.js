import BlockInstance from "../find-bar/blockly/BlockInstance.js";
import Utils from "../find-bar/blockly/Utils.js";
import { createEditorModal } from "../../modal.js";

export default class BroadcastTree {
  constructor(addon, msg) {
    this.addon = addon;
    this.msg = msg;
    this.utils = new Utils(addon);
    this.vm = addon.tab.traps.vm;
  }

  /**
   * Extract broadcast ID from a broadcast block
   */
  getBroadcastId(block) {
    if (!block) return null;

    if (block.type === "event_whenbroadcastreceived") {
      const fieldRow = block.inputList[0].fieldRow;
      const broadcastField = fieldRow.find((input) => input.name === "BROADCAST_OPTION");
      return broadcastField ? broadcastField.getText() : null;
    } else if (block.type === "event_broadcast" || block.type === "event_broadcastandwait") {
      const broadcastInput = block.getChildren()[0];
      if (!broadcastInput) return null;

      if (broadcastInput.type === "event_broadcast_menu") {
        return broadcastInput.inputList[0].fieldRow[0].getText();
      } else {
        return "complex broadcast";
      }
    }

    return null;
  }

  /**
   * Find all senders and receivers for a broadcast ID
   */
  getSendersAndReceivers(broadcastId) {
    const senders = [];
    const receivers = [];
    const runtime = this.vm.runtime;
    const targets = runtime.targets;

    for (const target of targets) {
      if (!target.isOriginal) {
        continue;
      }

      const blocks = target.blocks;
      if (!blocks._blocks) {
        continue;
      }

      for (const id of Object.keys(blocks._blocks)) {
        const block = blocks._blocks[id];

        if (block.opcode === "event_whenbroadcastreceived" && 
            block.fields.BROADCAST_OPTION && 
            block.fields.BROADCAST_OPTION.value === broadcastId) {
          receivers.push(new BlockInstance(target, block));
        }
        
        else if (block.opcode === "event_broadcast" || block.opcode === "event_broadcastandwait") {
          const broadcastInputBlockId = block.inputs.BROADCAST_INPUT?.block;
          if (broadcastInputBlockId) {
            const broadcastInputBlock = blocks._blocks[broadcastInputBlockId];
            if (broadcastInputBlock) {
              let eventName;
              if (broadcastInputBlock.opcode === "event_broadcast_menu") {
                eventName = broadcastInputBlock.fields.BROADCAST_OPTION?.value;
              } else {
                eventName = "complex broadcast";
              }
              if (eventName === broadcastId) {
                senders.push(new BlockInstance(target, block));
              }
            }
          }
        }
      }
    }

    return { senders, receivers };
  }

  /**
   * Show the broadcast tree modal
   */
  showBroadcastTree(block) {
    const broadcastId = this.getBroadcastId(block);
    if (!broadcastId) {
      console.warn("Could not determine broadcast ID from block");
      return;
    }

    const { senders, receivers } = this.getSendersAndReceivers(broadcastId);
    
    const title = `Broadcast Tree: ${broadcastId}`;
    const modal = createEditorModal(this.addon.tab, title, { isOpen: true });
    
    this.buildTreeContent(modal.content, senders, receivers);
    
    modal.backdrop.addEventListener("click", () => modal.remove());
    modal.closeButton.addEventListener("click", () => modal.remove());
  }

  /**
   * Build the tree content in the modal
   */
  buildTreeContent(container, senders, receivers) {
    const treeContainer = document.createElement("div");
    treeContainer.className = "broadcast-tree-container";
    
    const sendersBySprite = this.groupBlocksBySprite(senders);
    const receiversBySprite = this.groupBlocksBySprite(receivers);
    
    this.createSection(treeContainer, "Senders", sendersBySprite, "sender");
    this.createSection(treeContainer, "Receivers", receiversBySprite, "receiver");
    
    container.appendChild(treeContainer);
  }

  /**
   * Group blocks by sprite name
   */
  groupBlocksBySprite(blocks) {
    const grouped = {};
    for (const blockInstance of blocks) {
      const target = this.vm.runtime.getTargetById(blockInstance.targetId);
      const spriteName = target ? (target.isStage ? "Stage" : target.getName()) : "Unknown";
      
      if (!grouped[spriteName]) {
        grouped[spriteName] = [];
      }
      grouped[spriteName].push(blockInstance);
    }
    return grouped;
  }

  /**
   * Create a section (senders or receivers) in the tree
   */
  createSection(container, title, blocksBySprite, type) {
    const section = document.createElement("div");
    section.className = `broadcast-tree-section broadcast-tree-${type}s`;
    
    const header = document.createElement("h3");
    header.className = "broadcast-tree-section-header";
    header.textContent = title;
    section.appendChild(header);
    
    const spriteNames = Object.keys(blocksBySprite).sort();
    for (const spriteName of spriteNames) {
      const blocks = blocksBySprite[spriteName];
      this.createSpriteGroup(section, spriteName, blocks, type);
    }
    
    container.appendChild(section);
  }

  /**
   * Create a sprite group with its blocks
   */
  createSpriteGroup(container, spriteName, blocks, type) {
    const group = document.createElement("div");
    group.className = "broadcast-tree-sprite-group";
    
    const spriteHeader = document.createElement("div");
    spriteHeader.className = "broadcast-tree-sprite-header";
    spriteHeader.textContent = `${spriteName} (${blocks.length})`;
    group.appendChild(spriteHeader);
    
    const blockList = document.createElement("div");
    blockList.className = "broadcast-tree-block-list";
    
    for (const blockInstance of blocks) {
      const blockItem = document.createElement("div");
      blockItem.className = `broadcast-tree-block-item broadcast-tree-${type}`;
      blockItem.textContent = `${type === "sender" ? "📡" : "🏁"} ${type} block`;
      
      blockItem.addEventListener("click", () => {
        this.utils.scrollBlockIntoView(blockInstance);
        const modal = blockItem.closest(".sa-modal-overlay, [class*='modal_modal-overlay']");
        if (modal) {
          modal.remove();
        }
      });
      
      blockList.appendChild(blockItem);
    }
    
    group.appendChild(blockList);
    container.appendChild(group);
  }
}
