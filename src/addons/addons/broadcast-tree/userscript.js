import BroadcastTree from "./BroadcastTree.js";

export default async function ({ addon, msg, console }) {
  const broadcastTree = new BroadcastTree(addon, msg);

  // Add context menu for broadcast blocks
  addon.tab.createBlockContextMenu(
    (items, block) => {
      const BROADCAST_BLOCKS = ["event_whenbroadcastreceived", "event_broadcast", "event_broadcastandwait"];
      
      if (BROADCAST_BLOCKS.includes(block.type)) {
        items.push({
          enabled: true,
          text: msg("show-broadcast-tree"),
          separator: true,
          callback: () => {
            broadcastTree.showBroadcastTree(block);
          },
        });
      }
      
      return items;
    },
    { blocks: true }
  );
}