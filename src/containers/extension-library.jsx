// Runtime validator: warn developers if extension getInfo() contains
// non-string values for toolbox-facing text/defaultValue fields.
//
// This helps avoid toolbox sanitizer errors like:
// "Unexpected input recieved in replaceUnsafeChars"
import React from 'react';
// ...existing imports...

function devValidateExtensionInfo(extensionInfo, extensionId = '') {
  if (process.env.NODE_ENV === 'production' || !extensionInfo) return;

  const blocks = extensionInfo.blocks || [];
  blocks.forEach((block, idx) => {
    if (block.text != null && typeof block.text !== 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        `Extension "${extensionId}" block[${idx}] has non-string "text". ` +
        `Toolbox text must be a string (use String(value) if needed).`,
        block
      );
    }
    const args = block.arguments || [];
    Object.keys(args).forEach(argKey => {
      const arg = args[argKey];
      if (arg && 'defaultValue' in arg && typeof arg.defaultValue !== 'string') {
        // eslint-disable-next-line no-console
        console.warn(
          `Extension "${extensionId}" block[${idx}] argument "${argKey}" has non-string "defaultValue". ` +
          `Argument defaultValue must be a string.`,
          arg
        );
      }
    });
  });
}

// Example usage: where extension getInfo() is consumed, call devValidateExtensionInfo(info, extensionId)
// BEFORE the extension info is passed to toolbox builder / blockly.

export { devValidateExtensionInfo };
