import BroadcastTree from "./BroadcastTree.js";

export default async function ({ addon, console, msg }) {
  const broadcastTree = new BroadcastTree(addon, msg);
  
  const BROADCAST_BLOCKS = ["event_whenbroadcastreceived", "event_broadcast", "event_broadcastandwait"];
  
  addon.tab.createBlockContextMenu(
    (items, block) => {
      if (addon.self.disabled) return items;
      
      if (BROADCAST_BLOCKS.includes(block.type)) {
        const makeSpaceItemIndex = items.findIndex((obj) => obj._isDevtoolsFirstItem);
        const insertBeforeIndex = makeSpaceItemIndex !== -1 ? makeSpaceItemIndex : items.length;
        
        items.splice(
          insertBeforeIndex,
          0,
          {
            enabled: true,
            text: msg("show-broadcast-tree"),
            callback: () => {
              broadcastTree.showBroadcastTree(block);
            },
            separator: true,
          }
        );
      }
      
      return items;
    },
    { blocks: true }
  );
}
