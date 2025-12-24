import BlockInstance from "../find-bar/blockly/BlockInstance.js";
import Utils from "../find-bar/blockly/Utils.js";

export default class BroadcastTree {
  constructor(addon, msg) {
    this.addon = addon;
    this.msg = msg;
    this.vm = addon.tab.traps.vm;
    this.utils = new Utils(addon);
  }

  getBroadcastId(block) {
    const editingTarget = this.vm.editingTarget;
    const blockData = editingTarget.blocks.getBlock(block.id);
    
    if (!blockData) return null;
    
    if (blockData.opcode === "event_whenbroadcastreceived") {
      return blockData.fields.BROADCAST_OPTION.id;
    } else if (blockData.opcode === "event_broadcast" || blockData.opcode === "event_broadcastandwait") {
      const input = blockData.inputs.BROADCAST_INPUT;
      if (input && input.shadow) {
        const shadowBlock = editingTarget.blocks.getBlock(input.shadow);
        if (shadowBlock && shadowBlock.fields.BROADCAST_OPTION) {
          return shadowBlock.fields.BROADCAST_OPTION.id;
        }
      }
    }
    
    return null;
  }

  getBroadcastName(broadcastId) {
    const editingTarget = this.vm.editingTarget;
    const broadcasts = editingTarget.blocks._blocks;
    
    for (const blockId in broadcasts) {
      const block = broadcasts[blockId];
      if (block.fields && block.fields.BROADCAST_OPTION && block.fields.BROADCAST_OPTION.id === broadcastId) {
        return block.fields.BROADCAST_OPTION.value;
      }
    }
    
    return broadcastId;
  }

  getSendersAndReceivers(broadcastId) {
    const senders = [];
    const receivers = [];
    
    for (const target of this.vm.runtime.targets) {
      if (!target.isOriginal) continue;
      
      const targetSenders = [];
      const targetReceivers = [];
      
      for (const blockId of Object.keys(target.blocks._blocks)) {
        const block = target.blocks.getBlock(blockId);
        
        if (block.opcode === "event_whenbroadcastreceived") {
          if (block.fields.BROADCAST_OPTION && block.fields.BROADCAST_OPTION.id === broadcastId) {
            targetReceivers.push(new BlockInstance(target, block));
          }
        } else if (block.opcode === "event_broadcast" || block.opcode === "event_broadcastandwait") {
          if (block.inputs.BROADCAST_INPUT) {
            const input = block.inputs.BROADCAST_INPUT;
            if (input.shadow) {
              const shadowBlock = target.blocks.getBlock(input.shadow);
              if (shadowBlock && shadowBlock.fields.BROADCAST_OPTION && 
                  shadowBlock.fields.BROADCAST_OPTION.id === broadcastId) {
                targetSenders.push(new BlockInstance(target, block));
              }
            }
          }
        }
      }
      
      if (targetSenders.length > 0) {
        senders.push({
          target: target,
          blocks: targetSenders
        });
      }
      
      if (targetReceivers.length > 0) {
        receivers.push({
          target: target,
          blocks: targetReceivers
        });
      }
    }
    
    return { senders, receivers };
  }

  showBroadcastTree(block) {
    const broadcastId = this.getBroadcastId(block);
    
    if (!broadcastId) {
      console.warn("Could not determine broadcast ID from block");
      return;
    }
    
    const broadcastName = this.getBroadcastName(broadcastId);
    const { senders, receivers } = this.getSendersAndReceivers(broadcastId);
    
    const title = this.msg("broadcast-tree-title", { broadcast: broadcastName });
    const modal = this.addon.tab.createModal(title, { isOpen: true });
    
    const treeContainer = document.createElement("div");
    treeContainer.className = "sa-broadcast-tree-container";
    
    const sendersSection = this.createSection(
      this.msg("senders"), 
      senders, 
      senders.length === 0 ? this.msg("no-senders") : null
    );
    treeContainer.appendChild(sendersSection);
    
    const receiversSection = this.createSection(
      this.msg("receivers"), 
      receivers, 
      receivers.length === 0 ? this.msg("no-receivers") : null
    );
    treeContainer.appendChild(receiversSection);
    
    modal.content.appendChild(treeContainer);
    
    modal.backdrop.addEventListener("click", () => modal.remove());
    modal.closeButton.addEventListener("click", () => modal.remove());
  }

  createSection(title, items, emptyMessage) {
    const section = document.createElement("div");
    section.className = "sa-broadcast-tree-section";
    
    const header = document.createElement("div");
    header.className = "sa-broadcast-tree-section-header";
    header.textContent = title;
    section.appendChild(header);
    
    if (emptyMessage) {
      const empty = document.createElement("div");
      empty.className = "sa-broadcast-tree-empty";
      empty.textContent = emptyMessage;
      section.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "sa-broadcast-tree-list";
      
      for (const item of items) {
        const spriteItem = this.createSpriteItem(item.target, item.blocks);
        list.appendChild(spriteItem);
      }
      
      section.appendChild(list);
    }
    
    return section;
  }

  createSpriteItem(target, blocks) {
    const spriteItem = document.createElement("div");
    spriteItem.className = "sa-broadcast-tree-sprite";
    
    const spriteHeader = document.createElement("div");
    spriteHeader.className = "sa-broadcast-tree-sprite-header";
    
    const spriteName = target.isStage ? this.msg("sprite-stage") : target.getName();
    spriteHeader.textContent = `${spriteName} (${blocks.length})`;
    
    spriteItem.appendChild(spriteHeader);
    
    const blocksList = document.createElement("div");
    blocksList.className = "sa-broadcast-tree-blocks";
    
    for (const blockInstance of blocks) {
      const blockItem = this.createBlockItem(blockInstance);
      blocksList.appendChild(blockItem);
    }
    
    spriteItem.appendChild(blocksList);
    
    return spriteItem;
  }

  createBlockItem(blockInstance) {
    const blockItem = document.createElement("div");
    blockItem.className = "sa-broadcast-tree-block-item";
    
    const target = this.vm.runtime.getTargetById(blockInstance.targetId);
    if (target) {
      const block = target.blocks.getBlock(blockInstance.id);
      if (block) {
        let label = "";
        if (block.opcode === "event_whenbroadcastreceived") {
          label = this.msg("when-receive");
        } else if (block.opcode === "event_broadcast") {
          label = this.msg("broadcast");
        } else if (block.opcode === "event_broadcastandwait") {
          label = this.msg("broadcast-and-wait");
        }
        blockItem.textContent = label;
      }
    }
    
    blockItem.addEventListener("click", () => {
      this.utils.scrollBlockIntoView(blockInstance);
    });
    
    return blockItem;
  }
}
