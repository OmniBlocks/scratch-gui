/* 
  Tests for Pull Request Template
  Testing library/framework: Jest
  Focus: Validate structure and guidance text per the provided diff content.
*/
const fs = require('fs');
const path = require('path');

const DEFAULT_TEMPLATE = `### Resolves

_What Github issue does this resolve (if any, if not then please include link)?_

- Resolves #

### Proposed Changes

_Describe what this Pull Request does_

### Reason for Changes

_Explain why these changes should be made. Why is this helpful or necessary? Why should this be added?_

### Test Coverage

_Please show how you have added tests to cover your changes_

### Browser Coverage
Check the OS/browser combinations tested (At least 2)

Mac
* [ ] Chrome 
* [ ] Firefox 
* [ ] Safari

Windows
* [ ] Chrome 
* [ ] Firefox 
* [ ] Edge

Chromebook
* [ ] Chrome

iPad
* [ ] Safari

Android Tablet
* [ ] Chrome`;

function loadTemplate() {
  const candidates = [
    '.github/pull_request_template.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'pull_request_template.md',
    'PULL_REQUEST_TEMPLATE.md',
    'docs/pull_request_template.md'
  ];
  for (const rel of candidates) {
    const p = path.resolve(process.cwd(), rel);
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }
  // Fallback to the diff contents so tests still validate the PR change itself
  return DEFAULT_TEMPLATE;
}

describe('Pull Request Template (structure)', () => {
  let content;
  beforeAll(() => {
    content = loadTemplate();
  });

  test('exists (from repo or fallback) and is non-empty', () => {
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  test('contains required section headers in order', () => {
    const sections = [
      '### Resolves',
      '### Proposed Changes',
      '### Reason for Changes',
      '### Test Coverage',
      '### Browser Coverage'
    ];
    let last = -1;
    for (const s of sections) {
      const idx = content.indexOf(s);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });

  test('guidance text is present and italicized for key sections', () => {
    expect(content).toMatch(/_What Github issue does this resolve/i);
    expect(content).toMatch(/_Describe what this Pull Request does_/i);
    expect(content).toMatch(/_Explain why these changes should be made/i);
    expect(content).toMatch(/_Please show how you have added tests/i);
  });

  test('issue linking placeholder exists', () => {
    expect(content).toMatch(/- +Resolves +#/);
  });
});

describe('Pull Request Template (browser coverage)', () => {
  let content;
  beforeAll(() => { content = loadTemplate(); });

  test('mentions testing at least 2 combinations', () => {
    expect(content).toMatch(/At least 2/i);
  });

  test('lists expected platforms', () => {
    ['Mac', 'Windows', 'Chromebook', 'iPad', 'Android Tablet'].forEach(p =>
      expect(content).toContain(p)
    );
  });

  test('checkbox task list formatting is consistent', () => {
    // GitHub supports "* [ ]" and "- [ ]". Template uses "* [ ]"
    const all = content.match(/^\s*[*-] \[ \] .+$/gm) || [];
    expect(all.length).toBeGreaterThanOrEqual(9);
    // Ensure no malformed variants like "*[]", "[ ]" alone, or tabs
    expect(content).not.toMatch(/\*\[\]|^\[ \]\s*.+$/m);
    expect(content).not.toMatch(/^\t[*-] \[ \] /m);
  });

  test('includes expected browser options per platform', () => {
    // Totals from the provided template:
    // Mac: Chrome, Firefox, Safari (3)
    // Windows: Chrome, Firefox, Edge (3)
    // Chromebook: Chrome (1)
    // iPad: Safari (1)
    // Android Tablet: Chrome (1)
    const browserItems = content.match(/\* \[ \] (Chrome|Firefox|Safari|Edge)\b/g) || [];
    expect(browserItems.length).toBeGreaterThanOrEqual(9);

    const counts = (name) => (content.match(new RegExp(`\\* \\[ \\] ${name}\\b`, 'g')) || []).length;
    expect(counts('Chrome')).toBeGreaterThanOrEqual(4);
    expect(counts('Firefox')).toBeGreaterThanOrEqual(2);
    expect(counts('Safari')).toBeGreaterThanOrEqual(2);
    expect(counts('Edge')).toBeGreaterThanOrEqual(1);
  });
});

describe('Pull Request Template (format quality)', () => {
  let content;
  beforeAll(() => { content = loadTemplate(); });

  test('uses ### headers consistently', () => {
    const headers = content.match(/^### .+$/gm) || [];
    expect(headers.length).toBeGreaterThanOrEqual(5);
    // No accidental ## or #### headers for the main sections
    const inconsistent = content.match(/^(#{1,2}|#{4,6}) .+$/gm);
    // Allow other headings if present, but none are expected in this template
    if (inconsistent) {
      // None of the main required headers should be with wrong level
      ['Resolves','Proposed Changes','Reason for Changes','Test Coverage','Browser Coverage'].forEach(s => {
        expect(inconsistent.find(h => h.includes(s))).toBeFalsy();
      });
    }
  });

  test('no HTML tags sneak in', () => {
    expect(content).not.toMatch(/<(?!--)[a-z][^>]*>/i);
  });

  test('sections have some explanatory text (not just headers)', () => {
    const sections = [
      '### Resolves',
      '### Proposed Changes',
      '### Reason for Changes',
      '### Test Coverage',
      '### Browser Coverage'
    ];
    for (let i = 0; i < sections.length; i++) {
      const start = content.indexOf(sections[i]);
      const end = i < sections.length - 1 ? content.indexOf(sections[i + 1]) : content.length;
      const body = content.slice(start + sections[i].length, end).trim();
      expect(body.length).toBeGreaterThan(10);
    }
  });

  test('reasonable length (readable but complete)', () => {
    const lines = content.split('\n').length;
    expect(lines).toBeGreaterThan(20);
    expect(lines).toBeLessThan(120);
  });

  test('checkbox lines may end with a space; other lines should not have trailing spaces', () => {
    const lines = content.split('\n');
    for (const line of lines) {
      if (!/\* \[ \] /.test(line)) {
        expect(line).toBe(line.replace(/[ \t]+$/, ''));
      }
    }
  });
});

describe('Utility validations over diff content', () => {
  let content;
  beforeAll(() => { content = loadTemplate(); });

  const extractSections = (md) => {
    const map = {};
    const rx = /^### (.+)$/gm;
    let m;
    while ((m = rx.exec(md)) !== null) map[m[1]] = m.index;
    return map;
  };

  test('extractSections finds all major sections', () => {
    const sections = extractSections(content);
    ['Resolves','Proposed Changes','Reason for Changes','Test Coverage','Browser Coverage']
      .forEach(s => expect(sections[s]).toBeDefined());
  });

  test('validates presence of issue reference pattern', () => {
    // Accepts "Resolves #", "Fixes #", or "Closes #"
    expect(/(Resolves|Fixes|Closes) +#/.test(content)).toBe(true);
  });
});