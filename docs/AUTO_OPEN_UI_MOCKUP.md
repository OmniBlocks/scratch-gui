# Auto-Open Feature UI Mockup

## Settings Modal Location

The auto-open toggle appears in the **Advanced Settings** modal, accessible via the gear icon in the menu bar.

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     Advanced Settings                      [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│  Featured                                                       │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ☐ 60 FPS (Custom FPS)                               [?]       │
│  ☐ Interpolation                                     [?]       │
│  ☐ High Quality Pen                                 [?]       │
│  ☐ Warp Timer                                       [?]       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│  Remove Limits                                                  │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ☐ Infinite Clones                                  [?]       │
│  ☐ Remove Fencing                                   [?]       │
│  ☐ Remove Miscellaneous Limits                     [?]       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│  Danger Zone                                                    │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  Custom Stage Size: [480] × [360]                             │
│  ☐ Disable Compiler                                 [?]       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│  File Management                                    ← NEW!     │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ☑ Auto-Open Last File                              [?]       │
│      Automatically opens your most recently saved file when    │
│      the editor loads. This uses the File System Access API    │
│      to remember files you've saved. Your browser must         │
│      support this feature.                                      │
│                                                                 │
│  [ Store settings in project ]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## UI Elements Detail

### Auto-Open Toggle

**Component Type:** Checkbox (FancyCheckbox)

**Label:** "Auto-Open Last File"

**Help Text (shown when [?] is clicked):**
> Automatically opens your most recently saved file when the editor loads. This uses the File System Access API to remember files you've saved. Your browser must support this feature.

**States:**
- ☐ Unchecked (default) - Auto-open disabled
- ☑ Checked - Auto-open enabled

### Section: File Management

**New section** added to the settings modal with header styling matching other sections (Aqua/Blue theme line).

**Position:** After "Danger Zone" section, before "Store settings in project" button

## User Interactions

### 1. Opening Advanced Settings
```
User clicks:  [⚙️ Gear icon] → Opens Advanced Settings modal
```

### 2. Enabling Auto-Open
```
User actions:
1. Scroll to "File Management" section
2. Click checkbox next to "Auto-Open Last File"
3. Checkbox changes from ☐ to ☑
4. Setting is immediately saved to localStorage
5. Close modal (optional)
```

### 3. Getting Help
```
User clicks:  [?] icon → Shows/hides help text below the toggle
```

### 4. Disabling Auto-Open
```
User actions:
1. Open Advanced Settings
2. Click checkbox to uncheck
3. Checkbox changes from ☑ to ☐
4. Setting is immediately saved to localStorage
```

## Visual Feedback

### Checkbox States

**Unchecked:**
```
☐ Auto-Open Last File                [?]
```

**Checked (Active):**
```
☑ Auto-Open Last File                [?]
```

**With Help Expanded:**
```
☑ Auto-Open Last File                [?]
    ↓ (help text shown below)
    Automatically opens your most recently saved file when
    the editor loads. This uses the File System Access API
    to remember files you've saved. Your browser must
    support this feature.
```

## Color Scheme

Following OmniBlocks Aqua theme:

- **Section Headers:** Aqua/Blue gradient line (`#00d9ff`)
- **Text:** White (`#ffffff`) on dark background
- **Checkbox:** Aqua highlight when checked
- **Help Icon:** Light gray (`#cccccc`)
- **Help Text:** Slightly dimmed white (`#e0e0e0`)

## Responsive Behavior

### Desktop (>768px)
- Full width section
- Help text wraps nicely
- Checkbox and label on same line

### Tablet (>480px)
- Slightly reduced padding
- Help text still inline
- All functionality preserved

### Mobile (<480px)
- Section headers remain full width
- Checkbox and label may wrap
- Help text full width below toggle

## Browser Compatibility Indicator

If File System Access API is **not supported** in the user's browser:

```
☐ Auto-Open Last File                [?]
    ⚠️ Your browser doesn't support the File System Access API.
    This feature requires Chrome 86+, Edge 86+, or Opera 72+.
```

## Animation & Transitions

1. **Checkbox toggle:** Smooth 200ms transition
2. **Help text expand:** Slide down animation (300ms)
3. **Section highlight:** Subtle pulse when setting is changed

## Accessibility

- **ARIA labels:** Checkbox properly labeled for screen readers
- **Keyboard navigation:** Tab to checkbox, Space to toggle, Enter to save
- **Focus indicators:** Clear outline when focused
- **Screen reader text:** "Auto-Open Last File setting. Currently {enabled/disabled}"

## Future Enhancement Mockup

### Planned: Recent Files List

```
  ═══════════════════════════════════════════════════════════
  File Management
  ═══════════════════════════════════════════════════════════

  ☑ Auto-Open Last File                              [?]

  Recent Files (most recent first):
  ┌─────────────────────────────────────────────────────────┐
  │ 1. my-awesome-game.sb3        2 minutes ago     [Open]  │
  │ 2. test-project.sb3           1 hour ago        [Open]  │
  │ 3. scratch-tutorial.sb3       Yesterday         [Open]  │
  │ 4. animation-demo.sb3         2 days ago        [Open]  │
  │ 5. music-player.sb3           1 week ago        [Open]  │
  └─────────────────────────────────────────────────────────┘

  [ Store settings in project ]
```

## Testing Checklist

Visual testing:
- [ ] Checkbox renders correctly
- [ ] Section header has proper styling
- [ ] Help icon is clickable and positioned correctly
- [ ] Help text wraps nicely on all screen sizes
- [ ] Colors match OmniBlocks theme
- [ ] Animations are smooth
- [ ] Focus states are visible

Functional testing:
- [ ] Clicking checkbox toggles state
- [ ] State persists after closing modal
- [ ] State persists after page reload
- [ ] Help text expands/collapses correctly
- [ ] Keyboard navigation works
- [ ] Screen reader announces state properly

## Implementation Notes

The UI uses existing components from the codebase:
- `BooleanSetting` wrapper component
- `FancyCheckbox` for styled checkbox
- `FormattedMessage` for internationalization (future)
- Existing modal CSS classes for consistency

No new CSS files needed - all styling reuses existing classes from:
- `settings-modal.css`
- Theme files (`aqua.js`, `blue.js`, etc.)
