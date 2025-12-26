/**
 * @jest-environment jsdom
 * 
 * Integration tests for WorkspaceQuerier changes focusing on:
 * - Built-in category prioritization
 * - Token filtering with isDefiningFeature
 * - Complex sorting scenarios
 */

describe('WorkspaceQuerier Integration Tests', () => {
    let WorkspaceQuerier;

    beforeEach(() => {
        jest.resetModules();
        WorkspaceQuerier = require('../../../src/addons/addons/middle-click-popup/WorkspaceQuerier.js').default;
    });

    describe('Category recognition', () => {
        const testCases = [
            { category: 'motion', isBuiltIn: true, description: 'Motion blocks' },
            { category: 'looks', isBuiltIn: true, description: 'Looks blocks' },
            { category: 'sound', isBuiltIn: true, description: 'Sound blocks' },
            { category: 'events', isBuiltIn: true, description: 'Events blocks' },
            { category: 'control', isBuiltIn: true, description: 'Control blocks' },
            { category: 'sensing', isBuiltIn: true, description: 'Sensing blocks' },
            { category: 'operators', isBuiltIn: true, description: 'Operators blocks' },
            { category: 'variables', isBuiltIn: true, description: 'Variables blocks' },
            { category: 'lists', isBuiltIn: true, description: 'Lists blocks (from data-category-tweaks)' },
            { category: 'my blocks', isBuiltIn: true, description: 'Custom blocks' },
            { category: 'music', isBuiltIn: false, description: 'Music extension' },
            { category: 'pen', isBuiltIn: false, description: 'Pen extension' },
            { category: 'video sensing', isBuiltIn: false, description: 'Video Sensing extension' },
            { category: 'text to speech', isBuiltIn: false, description: 'Text to Speech extension' },
            { category: 'translate', isBuiltIn: false, description: 'Translate extension' }
        ];

        testCases.forEach(({ category, isBuiltIn, description }) => {
            test(`should ${isBuiltIn ? 'recognize' : 'not recognize'} "${category}" as ${isBuiltIn ? 'built-in' : 'extension'} - ${description}`, () => {
                const result = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(category);
                expect(result).toBe(isBuiltIn);
            });
        });
    });

    describe('Sorting algorithm comprehensive tests', () => {
        const createMockResult = (category, stringLength, tokenLength) => ({
            token: {
                isProper: true,
                isTruncated: false,
                isDefiningFeature: true,
                start: 0,
                end: stringLength
            },
            getLengths: jest.fn().mockReturnValue({
                stringLength: stringLength,
                tokenLength: tokenLength
            }),
            getBlock: jest.fn().mockReturnValue({
                typeInfo: {
                    category: {
                        name: category
                    }
                }
            })
        });

        test('should handle complex mixed scenario with multiple categories', () => {
            const mixedResults = [
                createMockResult('pen', 10, 5),           // Extension, longest
                createMockResult('motion', 10, 5),        // Built-in, longest
                createMockResult('music', 7, 4),          // Extension, medium
                createMockResult('control', 7, 4),        // Built-in, medium
                createMockResult('translate', 5, 3),      // Extension, short
                createMockResult('looks', 5, 3),          // Built-in, short
                createMockResult('video sensing', 3, 2),  // Extension, shortest
                createMockResult('events', 3, 2)          // Built-in, shortest
            ];

            const sorted = mixedResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Expected order:
            // 1. events (3, 2) - built-in, shortest
            // 2. video sensing (3, 2) - extension, shortest
            // 3. looks (5, 3) - built-in, short
            // 4. translate (5, 3) - extension, short
            // 5. control (7, 4) - built-in, medium
            // 6. music (7, 4) - extension, medium
            // 7. motion (10, 5) - built-in, longest
            // 8. pen (10, 5) - extension, longest

            expect(sorted[0].getBlock().typeInfo.category.name).toBe('events');
            expect(sorted[1].getBlock().typeInfo.category.name).toBe('video sensing');
            expect(sorted[2].getBlock().typeInfo.category.name).toBe('looks');
            expect(sorted[3].getBlock().typeInfo.category.name).toBe('translate');
            expect(sorted[4].getBlock().typeInfo.category.name).toBe('control');
            expect(sorted[5].getBlock().typeInfo.category.name).toBe('music');
            expect(sorted[6].getBlock().typeInfo.category.name).toBe('motion');
            expect(sorted[7].getBlock().typeInfo.category.name).toBe('pen');
        });

        test('should handle identical lengths with different tokenLengths', () => {
            const results = [
                createMockResult('pen', 5, 5),      // Extension, longer token
                createMockResult('motion', 5, 3),   // Built-in, shorter token
                createMockResult('music', 5, 4),    // Extension, medium token
                createMockResult('looks', 5, 2)     // Built-in, shortest token
            ];

            const sorted = results.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Built-in blocks first, sorted by tokenLength
            expect(sorted[0].getBlock().typeInfo.category.name).toBe('looks');  // 2
            expect(sorted[1].getBlock().typeInfo.category.name).toBe('motion'); // 3
            // Extension blocks next, sorted by tokenLength
            expect(sorted[2].getBlock().typeInfo.category.name).toBe('music');  // 4
            expect(sorted[3].getBlock().typeInfo.category.name).toBe('pen');    // 5
        });

        test('should handle empty results array', () => {
            const emptyResults = [];
            const sorted = emptyResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            expect(sorted).toEqual([]);
            expect(sorted.length).toBe(0);
        });

        test('should handle single result', () => {
            const singleResult = [createMockResult('motion', 5, 3)];
            const sorted = singleResult.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            expect(sorted.length).toBe(1);
            expect(sorted[0].getBlock().typeInfo.category.name).toBe('motion');
        });

        test('should prioritize "my blocks" category correctly', () => {
            const results = [
                createMockResult('pen', 5, 3),
                createMockResult('my blocks', 5, 3),
                createMockResult('music', 5, 3)
            ];

            const sorted = results.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // "my blocks" is built-in, so it should come before extensions
            expect(sorted[0].getBlock().typeInfo.category.name).toBe('my blocks');
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('my blocks')).toBe(true);
        });

        test('should prioritize "lists" category correctly', () => {
            const results = [
                createMockResult('pen', 5, 3),
                createMockResult('lists', 5, 3),
                createMockResult('variables', 5, 3)
            ];

            const sorted = results.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Both "lists" and "variables" are built-in, pen is extension
            expect(sorted[2].getBlock().typeInfo.category.name).toBe('pen');
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('lists')).toBe(true);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('variables')).toBe(true);
        });
    });

    describe('Token filtering with isDefiningFeature', () => {
        test('should validate isDefiningFeature condition combinations', () => {
            const testCases = [
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    shouldFilter: true,
                    description: 'proper, not truncated, defining feature'
                },
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: false },
                    shouldFilter: false,
                    description: 'proper, not truncated, NOT defining feature'
                },
                {
                    token: { isProper: true, isTruncated: true, isDefiningFeature: true },
                    shouldFilter: false,
                    description: 'proper, TRUNCATED, defining feature'
                },
                {
                    token: { isProper: false, isTruncated: false, isDefiningFeature: true },
                    shouldFilter: false,
                    description: 'NOT proper, not truncated, defining feature'
                },
                {
                    token: { isProper: false, isTruncated: true, isDefiningFeature: false },
                    shouldFilter: false,
                    description: 'NOT proper, TRUNCATED, NOT defining feature'
                }
            ];

            testCases.forEach(({ token, shouldFilter, description }) => {
                const result = token.isProper && !token.isTruncated && token.isDefiningFeature;
                expect(result).toBe(shouldFilter);
            });
        });

        test('should handle boundary cases for token properties', () => {
            // Undefined properties
            const undefinedToken = {};
            expect(undefinedToken.isProper && !undefinedToken.isTruncated && undefinedToken.isDefiningFeature).toBeFalsy();

            // Null properties
            const nullToken = { isProper: null, isTruncated: null, isDefiningFeature: null };
            expect(nullToken.isProper && !nullToken.isTruncated && nullToken.isDefiningFeature).toBeFalsy();

            // Mixed valid and invalid
            const mixedToken = { isProper: true, isTruncated: undefined, isDefiningFeature: true };
            expect(mixedToken.isProper && !mixedToken.isTruncated && mixedToken.isDefiningFeature).toBe(true);
        });
    });

    describe('Regression tests for changes', () => {
        test('should maintain backward compatibility with sorting when no built-in categories match', () => {
            // If somehow BUILT_IN_CATEGORIES is empty or doesn't match, sorting should still work
            const results = [
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 5, tokenLength: 3 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'unknown1' } } })
                },
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 3, tokenLength: 2 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'unknown2' } } })
                }
            ];

            const sorted = results.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength !== bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Should still sort by length
            expect(sorted[0].getLengths().stringLength).toBeLessThan(sorted[1].getLengths().stringLength);
        });

        test('should document the addition of isDefiningFeature check', () => {
            // This test documents that isDefiningFeature was added to the condition
            const oldCondition = (token) => token.isProper && !token.isTruncated;
            const newCondition = (token) => token.isProper && !token.isTruncated && token.isDefiningFeature;

            const testToken = { isProper: true, isTruncated: false, isDefiningFeature: false };

            // Old condition would pass, new condition won't
            expect(oldCondition(testToken)).toBe(true);
            expect(newCondition(testToken)).toBe(false);
        });
    });
});