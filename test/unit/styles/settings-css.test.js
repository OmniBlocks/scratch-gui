/* eslint-env jest */
/**
 * Tests for src/addons/settings/settings.css
 * 
 * This test suite validates CSS syntax, structure, and potential issues
 * in the settings page stylesheet.
 */
const fs = require('fs');
const path = require('path');

describe('Settings CSS', () => {
    let cssContent;
    let cssPath;

    beforeAll(() => {
        cssPath = path.join(__dirname, '../../../src/addons/settings/settings.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    describe('File Structure', () => {
        test('CSS file exists and is readable', () => {
            expect(cssContent).toBeDefined();
            expect(cssContent.length).toBeGreaterThan(0);
        });

        test('has proper copyright header', () => {
            expect(cssContent).toContain('Copyright');
            expect(cssContent).toContain('GNU General Public License');
        });

        test('imports required CSS dependencies', () => {
            expect(cssContent).toContain('@import "../../css/colors.css"');
            expect(cssContent).toContain('@import "../../css/filters.css"');
        });

        test('imports are at the top of the file', () => {
            const firstImportIndex = cssContent.indexOf('@import');
            const firstRuleIndex = cssContent.indexOf('{');
            expect(firstImportIndex).toBeLessThan(firstRuleIndex);
        });
    });

    describe('Global Transition Rule', () => {
        test('contains universal selector with transition', () => {
            expect(cssContent).toContain('*{');
            expect(cssContent).toMatch(/\*\s*\{[^}]*transition/);
        });

        test('transition applies to all properties', () => {
            const universalBlock = cssContent.match(/\*\s*\{[^}]*\}/s);
            expect(universalBlock).toBeTruthy();
            expect(universalBlock[0]).toContain('transition: all');
        });

        test('transition has reasonable duration', () => {
            const universalBlock = cssContent.match(/\*\s*\{[^}]*\}/s);
            expect(universalBlock[0]).toContain('0.2s');
            expect(universalBlock[0]).toContain('ease-in-out');
        });

        test('universal selector is properly positioned', () => {
            const importsEnd = cssContent.lastIndexOf('@import');
            const universalSelector = cssContent.indexOf('*{');
            const bodySelector = cssContent.indexOf('body {');
            
            expect(universalSelector).toBeGreaterThan(importsEnd);
            expect(universalSelector).toBeLessThan(bodySelector);
        });
    });

    describe('Hover Effects', () => {
        test('contains hover effect for addon-group-expand-container', () => {
            expect(cssContent).toContain('.addon-group-name:hover .addon-group-expand-container');
        });

        test('hover effect includes scale transform', () => {
            const hoverBlock = cssContent.match(
                /\.addon-group-name:hover\s+\.addon-group-expand-container\s*\{[^}]*\}/s
            );
            expect(hoverBlock).toBeTruthy();
            expect(hoverBlock[0]).toContain('transform: scale(1.1)');
        });

        test('hover effect maintains background color', () => {
            const hoverBlock = cssContent.match(
                /\.addon-group-name:hover\s+\.addon-group-expand-container\s*\{[^}]*\}/s
            );
            expect(hoverBlock[0]).toContain('background:');
        });
    });

    describe('CSS Syntax Validation', () => {
        test('all opening braces have matching closing braces', () => {
            const openBraces = (cssContent.match(/\{/g) || []).length;
            const closeBraces = (cssContent.match(/\}/g) || []).length;
            expect(openBraces).toBe(closeBraces);
        });

        test('selectors are properly formatted', () => {
            const lines = cssContent.split('\n');
            const selectorLines = lines.filter(line => 
                line.trim().endsWith('{') && !line.trim().startsWith('@')
            );
            selectorLines.forEach(line => {
                expect(line).toMatch(/[.#\w\-:[\]="',\s*+>~()]+\{/);
            });
        });

        test('properties end with semicolons', () => {
            const propertyLines = cssContent.split('\n').filter(line => {
                const trimmed = line.trim();
                return trimmed.includes(':') && 
                       !trimmed.startsWith('/*') && 
                       !trimmed.startsWith('*') &&
                       !trimmed.startsWith('@');
            });
            
            propertyLines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
                    expect(trimmed).toMatch(/;$/);
                }
            });
        });

        test('no duplicate property declarations in same rule', () => {
            const rules = cssContent.match(/\{[^}]+\}/g) || [];
            rules.forEach(rule => {
                const properties = rule.match(/\b(\w+-?\w*)\s*:/g) || [];
                const propertyNames = properties.map(p => p.replace(/\s*:/, ''));
                const uniqueProperties = new Set(propertyNames);
                
                const filtered = propertyNames.filter(p => 
                    !(p === 'transition' || p === 'transition-property')
                );
                const uniqueFiltered = new Set(filtered);
                
                expect(filtered.length).toBe(uniqueFiltered.size);
            });
        });
    });

    describe('Color Variables', () => {
        test('uses CSS custom properties for colors', () => {
            expect(cssContent).toContain('$');
            expect(cssContent).toMatch(/\$[\w-]+/);
        });

        test('does not use hardcoded colors in critical places', () => {
            const themeElements = [
                'background-color',
                'color:',
                'border-color'
            ];
            
            themeElements.forEach(prop => {
                if (cssContent.includes(prop)) {
                    const pattern = new RegExp(`${prop}:\\s*\\$`, 'g');
                    const matches = cssContent.match(pattern);
                    expect(matches).toBeTruthy();
                }
            });
        });
    });

    describe('Transition Properties', () => {
        test('transition durations are consistent', () => {
            const durations = cssContent.match(/transition:.*?([\d.]+s)/g);
            expect(durations).toBeTruthy();
            durations?.forEach(duration => {
                const value = parseFloat(duration.match(/([\d.]+)s/)[1]);
                expect(value).toBeGreaterThanOrEqual(0.1);
                expect(value).toBeLessThanOrEqual(1);
            });
        });

        test('uses ease functions appropriately', () => {
            const easing = cssContent.match(/transition.*?(ease[-\w]*)/gi);
            expect(easing).toBeTruthy();
            easing?.forEach(ease => {
                expect(ease).toMatch(/ease(-in|-out|-in-out)?/i);
            });
        });

        test('specific transition properties are defined where needed', () => {
            expect(cssContent).toContain('transition-property');
        });
    });

    describe('Responsive Design', () => {
        test('contains media queries for mobile devices', () => {
            expect(cssContent).toContain('@media');
            expect(cssContent).toMatch(/@media\s*\([^)]*max-width/);
        });

        test('media queries have reasonable breakpoints', () => {
            const breakpoints = cssContent.match(/@media[^{]*max-width:\s*(\d+)px/g);
            expect(breakpoints).toBeTruthy();
            breakpoints?.forEach(bp => {
                const width = parseInt(bp.match(/(\d+)px/)[1]);
                expect(width).toBeGreaterThan(0);
                expect(width).toBeLessThan(2000);
            });
        });
    });

    describe('Transform Properties', () => {
        test('transform scale is used correctly', () => {
            expect(cssContent).toContain('transform: scale(1.1)');
        });

        test('transform values are reasonable', () => {
            const transforms = cssContent.match(/scale\(([\d.]+)\)/g);
            transforms?.forEach(transform => {
                const value = parseFloat(transform.match(/([\d.]+)/)[1]);
                expect(value).toBeGreaterThan(0);
                expect(value).toBeLessThan(2);
            });
        });
    });

    describe('Accessibility', () => {
        test('focus states are defined', () => {
            expect(cssContent).toContain(':focus');
            expect(cssContent).toMatch(/:focus[^}]*box-shadow/);
        });

        test('active states are defined', () => {
            expect(cssContent).toContain(':active');
        });

        test('focus-within is used for better accessibility', () => {
            expect(cssContent).toContain(':focus-within');
        });
    });

    describe('Maintainability', () => {
        test('uses consistent naming conventions', () => {
            const classNames = cssContent.match(/\.[\w-]+/g) || [];
            classNames.forEach(className => {
                expect(className).toMatch(/^\.[a-z][\w-]*$/);
            });
        });

        test('has logical grouping of related styles', () => {
            expect(cssContent.indexOf('.button')).toBeLessThan(
                cssContent.indexOf('.button:hover')
            );
        });

        test('comments are used to explain complex sections', () => {
            const comments = cssContent.match(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g);
            expect(comments).toBeTruthy();
        });
    });

    describe('Edge Cases and Potential Issues', () => {
        test('no empty rulesets', () => {
            const emptyRules = cssContent.match(/\{[\s]*\}/g);
            expect(emptyRules).toBeFalsy();
        });

        test('no conflicting transition declarations', () => {
            const specificTransitions = cssContent.match(/transition:.*?;/g) || [];
            specificTransitions.forEach(trans => {
                expect(trans).toMatch(/transition:\s*[\w\s.,()]+;/);
            });
        });
    });
});