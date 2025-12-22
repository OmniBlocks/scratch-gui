# Extension guidelines (short)

This file documents a few GUI-side expectations for extensions so they integrate reliably.

1) Sandbox runner return shape
- When the GUI executes extension reporter code via the sandboxed runner, it expects an object with a `value` property.
- The GUI's sandbox runner returns: `{ value, success, error? }`.
  - On success: `{ value: <result>, success: true }`
  - On error: `{ value: undefined, success: false, error: "<message>" }`

2) Toolbox-facing text values must be strings
- All `blocks[*].text` values must be strings.
- All argument `defaultValue` values must be strings.
- Non-strings (null, undefined, objects) can trigger toolbox sanitization errors:
  `Unexpected input recieved in replaceUnsafeChars`.
- If you must pass a non-string, convert it with `String(value)` before returning `getInfo()`.

3) FieldCustom registration expectations
- If your extension uses a custom field (FieldCustom), register it before `getInfo()` is consumed:
  - e.g. at module load:
    ```js
    ScratchBlocks.FieldCustom.registerInput('myEditor', '<input .../>', onInit, onClick, onUpdate);
    ```
  - The block JSON must match the registered key:
    ```js
    {
      "type": "custom",
      "custom": "myEditor",
      "defaultValue": ""
    }
    ```
  - `defaultValue` must be a string.
- `onInit` / `onUpdate` handlers should sync the DOM `<input>` value with the field's value so the editor renders editable text.

Notes:
- These expectations are GUI-side conventions to avoid runtime errors and sanitizer failures. The FieldCustom implementation itself is provided by the bundled blocks build (develop-builds); the GUI bridges the exported FieldCustom into ScratchBlocks during startup.
