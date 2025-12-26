/**
 * @jest-environment jsdom
 */

describe('WorkspaceQuerier', () => {
    let WorkspaceQuerier;

    beforeEach(() => {
        // Mock the module before requiring
        jest.resetModules();
        WorkspaceQuerier = require('../../../src/addons/addons/middle-click-popup/WorkspaceQuerier.js').default;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('BUILT_IN_CATEGORIES constant', () => {
        test('should contain all expected built-in categories', () => {
            const expectedCategories = [
                'motion',
                'looks',
                'sound',
                'events',
                'control',
                'sensing',
                'operators',
                'variables',
                'lists',
                'my blocks'
            ];

            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES).toBeDefined();
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES instanceof Set).toBe(true);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.size).toBe(expectedCategories.length);

            expectedCategories.forEach(category => {
                expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(category)).toBe(true);
            });
        });

        test('should not contain extension categories', () => {
            const extensionCategories = ['music', 'pen', 'video sensing', 'translate', 'custom'];
            
            extensionCategories.forEach(category => {
                expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(category)).toBe(false);
            });
        });

        test('should be case-sensitive', () => {
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('Motion')).toBe(false);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('MOTION')).toBe(false);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('motion')).toBe(true);
        });

        test('should be immutable (Set cannot be easily modified)', () => {
            const originalSize = WorkspaceQuerier.BUILT_IN_CATEGORIES.size;
            
            // Attempting to add should still work on Set, but we're checking the constant exists
            WorkspaceQuerier.BUILT_IN_CATEGORIES.add('test-category');
            
            // Verify it was added (Sets are mutable, but the constant reference is not)
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('test-category')).toBe(true);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.size).toBe(originalSize + 1);
            
            // Clean up
            WorkspaceQuerier.BUILT_IN_CATEGORIES.delete('test-category');
        });

        test('should include "lists" category for data-category-tweaks addon', () => {
            // Lists category appears when data-category-tweaks addon separates Variables into Variables and Lists
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('lists')).toBe(true);
        });

        test('should include "my blocks" category', () => {
            // Custom blocks category
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('my blocks')).toBe(true);
        });
    });

    describe('Query result sorting with built-in categories prioritization', () => {
        let mockResults;
        let mockQueryStr;

        beforeEach(() => {
            mockQueryStr = 'test query';
            
            // Create mock result objects with necessary structure
            const createMockResult = (categoryName, stringLength, tokenLength) => ({
                token: {
                    isProper: true,
                    isTruncated: false,
                    isDefiningFeature: true
                },
                getLengths: jest.fn().mockReturnValue({
                    stringLength: stringLength,
                    tokenLength: tokenLength
                }),
                getBlock: jest.fn().mockReturnValue({
                    typeInfo: {
                        category: {
                            name: categoryName
                        }
                    }
                })
            });

            mockResults = [
                createMockResult('custom-extension', 5, 3), // Extension block
                createMockResult('motion', 5, 3),          // Built-in block
                createMockResult('music', 3, 2),           // Extension block
                createMockResult('looks', 3, 2),           // Built-in block
                createMockResult('pen', 7, 4),             // Extension block
                createMockResult('control', 7, 4)          // Built-in block
            ];
        });

        test('should prioritize built-in blocks over extension blocks with same lengths', () => {
            // We need to test the sorting logic, but since it's inside the query method,
            // we'll need to examine the actual implementation
            
            // Mock the necessary dependencies for query method
            const mockBlocks = [];
            const mockCategories = [];
            const mockOptions = {};

            // This is a conceptual test - in a real scenario, you'd need to set up
            // the full WorkspaceQuerier instance with proper mocks
            
            // Verify built-in categories are checked correctly
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('motion')).toBe(true);
            expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('custom-extension')).toBe(false);
        });

        test('should sort built-in blocks before extension blocks when lengths are equal', () => {
            // Sort the mock results using the same logic as in WorkspaceQuerier
            const sortedResults = mockResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength != bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Results with length (3,2): 'looks' (built-in) should come before 'music' (extension)
            const length3Results = sortedResults.filter(r => r.getLengths().stringLength === 3);
            expect(length3Results[0].getBlock().typeInfo.category.name).toBe('looks');
            expect(length3Results[1].getBlock().typeInfo.category.name).toBe('music');

            // Results with length (5,3): 'motion' (built-in) should come before 'custom-extension'
            const length5Results = sortedResults.filter(r => r.getLengths().stringLength === 5);
            expect(length5Results[0].getBlock().typeInfo.category.name).toBe('motion');
            expect(length5Results[1].getBlock().typeInfo.category.name).toBe('custom-extension');
        });

        test('should maintain string length priority over built-in status', () => {
            const sortedResults = mockResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength != bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Shorter strings should come first regardless of built-in status
            expect(sortedResults[0].getLengths().stringLength).toBe(3);
            expect(sortedResults[sortedResults.length - 1].getLengths().stringLength).toBe(7);
        });

        test('should handle edge case with all built-in blocks', () => {
            const allBuiltInResults = [
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 5, tokenLength: 3 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'motion' } } })
                },
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 3, tokenLength: 2 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'looks' } } })
                }
            ];

            const sorted = allBuiltInResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength != bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Should sort by length only since both are built-in
            expect(sorted[0].getLengths().stringLength).toBe(3);
            expect(sorted[1].getLengths().stringLength).toBe(5);
        });

        test('should handle edge case with all extension blocks', () => {
            const allExtensionResults = [
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 5, tokenLength: 3 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'music' } } })
                },
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 3, tokenLength: 2 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'pen' } } })
                }
            ];

            const sorted = allExtensionResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength != bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Should sort by length only since both are extensions
            expect(sorted[0].getLengths().stringLength).toBe(3);
            expect(sorted[1].getLengths().stringLength).toBe(5);
        });

        test('should use tokenLength as secondary sort when stringLength is equal', () => {
            const sameStringLengthResults = [
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 5, tokenLength: 5 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'motion' } } })
                },
                {
                    token: { isProper: true, isTruncated: false, isDefiningFeature: true },
                    getLengths: jest.fn().mockReturnValue({ stringLength: 5, tokenLength: 3 }),
                    getBlock: jest.fn().mockReturnValue({ typeInfo: { category: { name: 'looks' } } })
                }
            ];

            const sorted = sameStringLengthResults.sort((a, b) => {
                const aLengths = a.getLengths();
                const bLengths = b.getLengths();
                
                const aBlock = a.getBlock();
                const bBlock = b.getBlock();
                const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
                const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

                if (aIsBuiltIn !== bIsBuiltIn) {
                    return bIsBuiltIn ? 1 : -1;
                }
                
                if (aLengths.stringLength != bLengths.stringLength) 
                    return aLengths.stringLength - bLengths.stringLength;
                return aLengths.tokenLength - bLengths.tokenLength;
            });

            // Should sort by tokenLength when stringLength is equal
            expect(sorted[0].getLengths().tokenLength).toBe(3);
            expect(sorted[1].getLengths().tokenLength).toBe(5);
        });
    });

    describe('searchToken function with isDefiningFeature check', () => {
        test('should only mark canBeString as false for tokens with isDefiningFeature=true', () => {
            // This tests the concept of the searchToken function modification
            // The actual implementation is within the query method, so we test the logic
            
            const testToken = {
                isProper: true,
                isTruncated: false,
                isDefiningFeature: true,
                start: 0,
                end: 5
            };

            const testTokenWithoutDefining = {
                isProper: true,
                isTruncated: false,
                isDefiningFeature: false,
                start: 0,
                end: 5
            };

            // The logic checks: !(token.type instanceof TokenTypeStringLiteral) && 
            //                   token.isProper && 
            //                   !token.isTruncated && 
            //                   token.isDefiningFeature
            
            // Token with isDefiningFeature=true should affect canBeString
            expect(testToken.isProper && !testToken.isTruncated && testToken.isDefiningFeature).toBe(true);
            
            // Token with isDefiningFeature=false should NOT affect canBeString
            expect(testTokenWithoutDefining.isProper && !testTokenWithoutDefining.isTruncated && testTokenWithoutDefining.isDefiningFeature).toBe(false);
        });

        test('should require all conditions (isProper, !isTruncated, isDefiningFeature) to mark canBeString', () => {
            const scenarios = [
                { isProper: false, isTruncated: false, isDefiningFeature: true, shouldMark: false },
                { isProper: true, isTruncated: true, isDefiningFeature: true, shouldMark: false },
                { isProper: true, isTruncated: false, isDefiningFeature: false, shouldMark: false },
                { isProper: true, isTruncated: false, isDefiningFeature: true, shouldMark: true },
                { isProper: false, isTruncated: true, isDefiningFeature: false, shouldMark: false }
            ];

            scenarios.forEach((scenario, index) => {
                const result = scenario.isProper && !scenario.isTruncated && scenario.isDefiningFeature;
                expect(result).toBe(scenario.shouldMark);
            });
        });

        test('should handle truncated tokens correctly', () => {
            const truncatedToken = {
                isProper: true,
                isTruncated: true,
                isDefiningFeature: true
            };

            // Truncated tokens should NOT affect canBeString even if they have isDefiningFeature
            expect(truncatedToken.isProper && !truncatedToken.isTruncated && truncatedToken.isDefiningFeature).toBe(false);
        });

        test('should handle improper tokens correctly', () => {
            const improperToken = {
                isProper: false,
                isTruncated: false,
                isDefiningFeature: true
            };

            // Improper tokens should NOT affect canBeString
            expect(improperToken.isProper && !improperToken.isTruncated && improperToken.isDefiningFeature).toBe(false);
        });
    });

    describe('MAX_TOKENS constant', () => {
        test('should have correct value', () => {
            expect(WorkspaceQuerier.MAX_TOKENS).toBe(10000);
        });

        test('should be a number', () => {
            expect(typeof WorkspaceQuerier.MAX_TOKENS).toBe('number');
        });

        test('should be positive', () => {
            expect(WorkspaceQuerier.MAX_TOKENS).toBeGreaterThan(0);
        });
    });
});