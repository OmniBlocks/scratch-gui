const fs = require('fs');
const path = require('path');

/**
 * Pull Request template structural tests.
 * Testing Framework: Jest (expect/toMatch etc.)
 */

const POSSIBLE_TEMPLATE_PATHS = [
    path.resolve(__dirname, '../../.github/pull_request_template.md'),
    path.resolve(__dirname, '../../pull_request_template.md'),
    path.resolve(__dirname, '../../docs/pull_request_template.md'),
    path.resolve(__dirname, '../../PULL_REQUEST_TEMPLATE.md')
];

const loadTemplate = () => {
    for (const candidate of POSSIBLE_TEMPLATE_PATHS) {
        if (fs.existsSync(candidate)) {
            return fs.readFileSync(candidate, 'utf8');
        }
    }
    throw new Error('Pull request template not found in expected locations');
};

describe('pull_request_template.md', () => {
    let template;

    beforeAll(() => {
        template = loadTemplate();
    });

    describe('base content', () => {
        test('contains all required section headers in correct order', () => {
            const expectedSections = [
                '### Resolves',
                '### Proposed Changes',
                '### Reason for Changes',
                '### Test Coverage',
                '### Browser Coverage'
            ];

            const locations = expectedSections.map(section => template.indexOf(section));

            locations.forEach((location, idx) => {
                expect(location).toBeGreaterThanOrEqual(0);
            });

            const sorted = [...locations].sort((a, b) => a - b);
            expect(locations).toEqual(sorted);
        });

        test('provides italicized prompts for each section', () => {
            const prompts = [
                '_What Github issue does this resolve (if any, if not then please include link)?_',
                '_Describe what this Pull Request does_',
                '_Explain why these changes should be made. Why is this helpful or necessary? Why should this be added?_',
                '_Please show how you have added tests to cover your changes_'
            ];

            prompts.forEach(prompt => {
                expect(template).toContain(prompt);
            });
        });

        test('includes GitHub issue reference guidance', () => {
            expect(template).toContain('- Resolves #');
            expect(template).toMatch(/Resolves\s+#\s*$/m);
        });
    });

    describe('browser coverage checklist', () => {
        test('enumerates Mac browsers', () => {
            expect(template).toMatch(/Mac[\s\S]*\* \[ \] Chrome/);
            expect(template).toMatch(/Mac[\s\S]*\* \[ \] Firefox/);
            expect(template).toMatch(/Mac[\s\S]*\* \[ \] Safari/);
        });

        test('enumerates Windows browsers', () => {
            expect(template).toMatch(/Windows[\s\S]*\* \[ \] Chrome/);
            expect(template).toMatch(/Windows[\s\S]*\* \[ \] Firefox/);
            expect(template).toMatch(/Windows[\s\S]*\* \[ \] Edge/);
        });

        test('enumerates additional device coverage', () => {
            expect(template).toMatch(/Chromebook[\s\S]*\* \[ \] Chrome/);
            expect(template).toMatch(/iPad[\s\S]*\* \[ \] Safari/);
            expect(template).toMatch(/Android Tablet[\s\S]*\* \[ \] Chrome/);
        });

        test('states minimum combinations requirement', () => {
            expect(template).toMatch(/At least\s*2/i);
        });

        test('leaves all checkboxes unchecked by default', () => {
            const allCheckboxes = template.match(/\[[^\]]]/g) || [];
            const checkedBoxes = template.match(/\[[xX]\]/g) || [];
            expect(allCheckboxes.length).toBeGreaterThan(0);
            expect(checkedBoxes.length).toBe(0);
        });
    });

    describe('formatting integrity', () => {
        test('uses markdown headers consistently', () => {
            const headers = template.match(/^#{3}\s.+$/gm) || [];
            expect(headers.length).toBeGreaterThanOrEqual(5);
        });

        test('has balanced emphasis markers', () => {
            const underscoreCount = (template.match(/_/g) || []).length;
            expect(underscoreCount % 2).toBe(0);
        });

        test('does not contain merge conflict markers or TODOs', () => {
            expect(template).not.toMatch(/<<<<<<<|=======|>>>>>>>/);
            expect(template).not.toMatch(/TODO|FIXME|XXX/i);
        });

        test('trims trailing spaces from most lines', () => {
            const lines = template.split(String.fromCharCode(10));
            const linesWithTrailingSpace = lines.filter(line => line !== line.trimEnd());
            expect(linesWithTrailingSpace.length).toBeLessThanOrEqual(5);
        });
    });

    describe('guidance and clarity', () => {
        test('encourages explanation of utility', () => {
            expect(template).toMatch(/Why these changes should be made/i);
        });

        test('references test coverage expectations explicitly', () => {
            expect(template).toMatch(/show how you have added tests/i);
        });

        test('keeps language professional', () => {
            expect(template).not.toMatch(/\b(gonna|wanna|lol|omg)\b/i);
        });
    });
});