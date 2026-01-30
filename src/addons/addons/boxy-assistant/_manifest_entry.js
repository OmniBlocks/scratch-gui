/* OmniBlocks custom addon */
const manifest = {
  "editorOnly": true,
  "noTranslations": true,
  "name": "Boxy AI Assistant",
  "description": "An AI-powered assistant in the form of Boxy to help you learn and code better. Features local AI models and helpful animations.",
  "credits": [
    {
      "name": "supervoidcoder",
      "link": "https://github.com/supervoidcoder"
    },
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
      "url": "style.css"
    }
  ],
  "tags": [
    "featured",
    "new"
  ],
  "enabledByDefault": false
};
export default manifest;
