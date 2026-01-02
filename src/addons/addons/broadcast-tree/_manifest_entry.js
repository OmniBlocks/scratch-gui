const manifest = {
  "editorOnly": true,
  "name": "Broadcast Tree",
  "description": "Right-click on broadcast blocks to show a tree view of all senders and receivers organized by sprite. Click on items to navigate to blocks.",
  "credits": [
    {
      "name": "OmniBlocks Team"
    }
  ],
  "dynamicDisable": true,
  "userscripts": [
    {
      "url": "userscript.js"
    }
  ],
  "userstyles": [
    {
      "url": "userstyle.css"
    }
  ],
  "tags": [
    "editor",
    "recommended"
  ],
  "enabledByDefault": true,
  "l10n": true,
  "l10n_overrides": {
    "show-broadcast-tree": "Show Broadcast Tree",
    "broadcast-tree-title": "Broadcast Tree: {broadcastName}",
    "senders": "Senders",
    "receivers": "Receivers"
  }
};
export default manifest;
