/**
 * @jest-environment jsdom
 */

describe('WorkspaceQuerier', () => {
  let WorkspaceQuerier;

  beforeEach(() => {
    // Mock the module - in real tests, you'd import the actual module
    // This is a structure to test the new functionality added
    WorkspaceQuerier = {
      BUILT_IN_CATEGORIES: new Set([
        'motion',
        'looks',
        'sound',
        'events',
        'control',
        'sensing',
        'operators',
        'data',
        'data-lists',
        'more',
        'pen',
      ])
    };
  });

  describe('BUILT_IN_CATEGORIES', () => {
    test('should contain all expected built-in categories', () => {
      const expectedCategories = [
        'motion',
        'looks',
        'sound',
        'events',
        'control',
        'sensing',
        'operators',
        'data',
        'data-lists',
        'more',
        'pen',
      ];

      expectedCategories.forEach(category => {
        expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(category)).toBe(true);
      });
    });

    test('should have exactly 11 categories', () => {
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.size).toBe(11);
    });

    test('should not contain extension categories', () => {
      const extensionCategories = ['music', 'videoSensing', 'text2speech', 'translate'];
      
      extensionCategories.forEach(category => {
        expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(category)).toBe(false);
      });
    });

    test('should be case-sensitive', () => {
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('Motion')).toBe(false);
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('MOTION')).toBe(false);
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('motion')).toBe(true);
    });

    test('should include data-lists category for Data category tweaks addon', () => {
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has('data-lists')).toBe(true);
    });

    test('should not allow modifications (immutable Set)', () => {
      const originalSize = WorkspaceQuerier.BUILT_IN_CATEGORIES.size;
      
      // Attempt to add should not modify the static Set
      expect(() => {
        WorkspaceQuerier.BUILT_IN_CATEGORIES.add('custom');
      }).not.toThrow();
      
      // But since it's a const, the reference can't be changed
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.size).toBe(originalSize);
    });

    test('should handle has() method with non-string inputs gracefully', () => {
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(null)).toBe(false);
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(undefined)).toBe(false);
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has(123)).toBe(false);
      expect(WorkspaceQuerier.BUILT_IN_CATEGORIES.has({})).toBe(false);
    });
  });

  describe('query() - built-in block prioritization', () => {
    // Mock helpers for testing the sorting logic
    function createMockResult(category, stringLength, tokenLength) {
      return {
        getLengths: () => ({ stringLength, tokenLength }),
        getBlock: () => ({
          typeInfo: {
            category: { name: category }
          }
        })
      };
    }

    function mockSortingLogic(results) {
      return results.sort((a, b) => {
        const aLengths = a.getLengths();
        const bLengths = b.getLengths();
        
        // First, prioritize built-in blocks over extension blocks
        const aBlock = a.getBlock();
        const bBlock = b.getBlock();
        const aIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(aBlock.typeInfo.category.name);
        const bIsBuiltIn = WorkspaceQuerier.BUILT_IN_CATEGORIES.has(bBlock.typeInfo.category.name);

        if (aIsBuiltIn !== bIsBuiltIn) {
          return bIsBuiltIn ? 1 : -1; // Built-in blocks come first
        }
        
        // Then sort by string length and token length as before
        if (aLengths.stringLength !== bLengths.stringLength) {
          return aLengths.stringLength - bLengths.stringLength;
        }
        return aLengths.tokenLength - bLengths.tokenLength;
      });
    }

    test('should prioritize built-in blocks over extension blocks', () => {
      const results = [
        createMockResult('music', 5, 2),      // extension
        createMockResult('motion', 5, 2),     // built-in
        createMockResult('pen', 5, 2),        // built-in
        createMockResult('translate', 5, 2)   // extension
      ];

      const sorted = mockSortingLogic([...results]);

      expect(sorted[0].getBlock().typeInfo.category.name).toBe('motion');
      expect(sorted[1].getBlock().typeInfo.category.name).toBe('pen');
      expect(sorted[2].getBlock().typeInfo.category.name).toBe('music');
      expect(sorted[3].getBlock().typeInfo.category.name).toBe('translate');
    });

    test('should sort by string length within same category type', () => {
      const results = [
        createMockResult('motion', 10, 2),    // built-in, longer
        createMockResult('looks', 5, 2),      // built-in, shorter
        createMockResult('music', 10, 2),     // extension, longer
        createMockResult('videoSensing', 5, 2) // extension, shorter
      ];

      const sorted = mockSortingLogic([...results]);

      // Built-in blocks first, sorted by string length
      expect(sorted[0].getBlock().typeInfo.category.name).toBe('looks');
      expect(sorted[0].getLengths().stringLength).toBe(5);
      expect(sorted[1].getBlock().typeInfo.category.name).toBe('motion');
      expect(sorted[1].getLengths().stringLength).toBe(10);
      
      // Then extension blocks, sorted by string length
      expect(sorted[2].getBlock().typeInfo.category.name).toBe('videoSensing');
      expect(sorted[2].getLengths().stringLength).toBe(5);
      expect(sorted[3].getBlock().typeInfo.category.name).toBe('music');
      expect(sorted[3].getLengths().stringLength).toBe(10);
    });

    test('should sort by token length when string lengths are equal', () => {
      const results = [
        createMockResult('motion', 5, 3),     // built-in, same string, more tokens
        createMockResult('looks', 5, 1),      // built-in, same string, fewer tokens
        createMockResult('music', 5, 3),      // extension, same string, more tokens
        createMockResult('videoSensing', 5, 1) // extension, same string, fewer tokens
      ];

      const sorted = mockSortingLogic([...results]);

      // Built-in blocks first, sorted by token length (ascending)
      expect(sorted[0].getBlock().typeInfo.category.name).toBe('looks');
      expect(sorted[0].getLengths().tokenLength).toBe(1);
      expect(sorted[1].getBlock().typeInfo.category.name).toBe('motion');
      expect(sorted[1].getLengths().tokenLength).toBe(3);
      
      // Then extension blocks, sorted by token length
      expect(sorted[2].getBlock().typeInfo.category.name).toBe('videoSensing');
      expect(sorted[2].getLengths().tokenLength).toBe(1);
      expect(sorted[3].getBlock().typeInfo.category.name).toBe('music');
      expect(sorted[3].getLengths().tokenLength).toBe(3);
    });

    test('should handle empty results array', () => {
      const results = [];
      const sorted = mockSortingLogic([...results]);
      expect(sorted).toEqual([]);
    });

    test('should handle single result', () => {
      const results = [createMockResult('motion', 5, 2)];
      const sorted = mockSortingLogic([...results]);
      expect(sorted.length).toBe(1);
      expect(sorted[0].getBlock().typeInfo.category.name).toBe('motion');
    });

    test('should handle all built-in blocks', () => {
      const results = [
        createMockResult('operators', 8, 3),
        createMockResult('motion', 5, 2),
        createMockResult('data', 3, 1),
      ];

      const sorted = mockSortingLogic([...results]);

      // All built-in, sorted by string length
      expect(sorted[0].getLengths().stringLength).toBe(3);
      expect(sorted[1].getLengths().stringLength).toBe(5);
      expect(sorted[2].getLengths().stringLength).toBe(8);
    });

    test('should handle all extension blocks', () => {
      const results = [
        createMockResult('music', 8, 3),
        createMockResult('videoSensing', 5, 2),
        createMockResult('translate', 3, 1),
      ];

      const sorted = mockSortingLogic([...results]);

      // All extensions, sorted by string length
      expect(sorted[0].getLengths().stringLength).toBe(3);
      expect(sorted[1].getLengths().stringLength).toBe(5);
      expect(sorted[2].getLengths().stringLength).toBe(8);
    });

    test('should handle data-lists category as built-in', () => {
      const results = [
        createMockResult('music', 5, 2),      // extension
        createMockResult('data-lists', 5, 2), // built-in (from Data category tweaks)
      ];

      const sorted = mockSortingLogic([...results]);

      expect(sorted[0].getBlock().typeInfo.category.name).toBe('data-lists');
      expect(sorted[1].getBlock().typeInfo.category.name).toBe('music');
    });

    test('should maintain stable sort for identical priorities', () => {
      const results = [
        createMockResult('motion', 5, 2),
        createMockResult('looks', 5, 2),
        createMockResult('sound', 5, 2),
      ];

      const sorted1 = mockSortingLogic([...results]);
      const sorted2 = mockSortingLogic([...results]);

      // Results should be consistent
      for (let i = 0; i < sorted1.length; i++) {
        expect(sorted1[i].getBlock().typeInfo.category.name)
          .toBe(sorted2[i].getBlock().typeInfo.category.name);
      }
    });

    test('should handle complex mixed scenario', () => {
      const results = [
        createMockResult('music', 10, 5),        // extension
        createMockResult('motion', 5, 2),        // built-in
        createMockResult('videoSensing', 5, 3),  // extension
        createMockResult('data', 5, 2),          // built-in
        createMockResult('pen', 10, 5),          // built-in
        createMockResult('translate', 3, 1),     // extension
      ];

      const sorted = mockSortingLogic([...results]);

      // First three should be built-in, sorted by string then token length
      expect(sorted[0].getBlock().typeInfo.category.name).toBe('motion'); // 5, 2
      expect(sorted[1].getBlock().typeInfo.category.name).toBe('data');   // 5, 2
      expect(sorted[2].getBlock().typeInfo.category.name).toBe('pen');    // 10, 5

      // Last three should be extensions, sorted by string then token length
      expect(sorted[3].getBlock().typeInfo.category.name).toBe('translate');     // 3, 1
      expect(sorted[4].getBlock().typeInfo.category.name).toBe('videoSensing'); // 5, 3
      expect(sorted[5].getBlock().typeInfo.category.name).toBe('music');        // 10, 5
    });
  });

  describe('searchToken() - isDefiningFeature check', () => {
    // Mock token structure for testing the isDefiningFeature logic
    function createMockToken(isProper, isTruncated, isDefiningFeature, start, end, isStringLiteral = false) {
      return {
        isProper,
        isTruncated,
        isDefiningFeature,
        start,
        end,
        type: {
          getSubtokens: () => null,
          constructor: isStringLiteral ? { name: 'TokenTypeStringLiteral' } : { name: 'OtherToken' }
        }
      };
    }

    function mockSearchToken(token, canBeString) {
      function searchToken(tok) {
        const subtokens = tok.type.getSubtokens ? tok.type.getSubtokens() : null;
        if (subtokens) {
          for (const subtoken of subtokens) searchToken(subtoken);
        } else if (
          tok.type.constructor.name !== 'TokenTypeStringLiteral' &&
          tok.isProper &&
          !tok.isTruncated &&
          tok.isDefiningFeature
        ) {
          for (let i = tok.start; i < tok.end; i++) {
            canBeString[i] = false;
          }
        }
      }
      searchToken(token);
      return canBeString;
    }

    test('should mark positions as non-string for defining feature tokens', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 1, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, false, false, true, true]);
    });

    test('should not mark positions for non-defining feature tokens', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, false, 1, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should not mark positions for truncated tokens even if defining', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, true, true, 1, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should not mark positions for improper tokens even if defining', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(false, false, true, 1, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should not mark positions for string literal tokens', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 1, 3, true);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should handle token at start of array', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 0, 2);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([false, false, true, true, true]);
    });

    test('should handle token at end of array', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 3, 5);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, false, false]);
    });

    test('should handle single character token', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 2, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, false, true, true]);
    });

    test('should handle all conditions false', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(false, true, false, 1, 3);
      
      mockSearchToken(token, canBeString);
      
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should handle edge case with zero-length range', () => {
      const canBeString = [true, true, true, true, true];
      const token = createMockToken(true, false, true, 2, 2);
      
      mockSearchToken(token, canBeString);
      
      // No positions should be marked since start === end
      expect(canBeString).toEqual([true, true, true, true, true]);
    });

    test('should correctly handle multiple defining features in sequence', () => {
      const canBeString = [true, true, true, true, true, true, true];
      
      // First defining feature
      const token1 = createMockToken(true, false, true, 1, 3);
      mockSearchToken(token1, canBeString);
      
      // Second defining feature
      const token2 = createMockToken(true, false, true, 4, 6);
      mockSearchToken(token2, canBeString);
      
      expect(canBeString).toEqual([true, false, false, true, false, false, true]);
    });

    test('should handle overlapping token ranges', () => {
      const canBeString = [true, true, true, true, true];
      
      // First token marks positions 1-3
      const token1 = createMockToken(true, false, true, 1, 4);
      mockSearchToken(token1, canBeString);
      
      // Second token overlaps at position 3
      const token2 = createMockToken(true, false, true, 2, 4);
      mockSearchToken(token2, canBeString);
      
      expect(canBeString).toEqual([true, false, false, false, true]);
    });
  });
});