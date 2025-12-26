/**
 * @jest-environment jsdom
 */

describe('data-category-tweaks-v2 manifest', () => {
    let manifest;

    beforeEach(() => {
        jest.resetModules();
        manifest = require('../../../src/addons/addons/data-category-tweaks-v2/_manifest_entry.js').default;
    });

    describe('manifest structure', () => {
        test('should have all required fields', () => {
            expect(manifest).toHaveProperty('name');
            expect(manifest).toHaveProperty('description');
            expect(manifest).toHaveProperty('tags');
            expect(manifest).toHaveProperty('enabledByDefault');
        });

        test('should have correct name', () => {
            expect(manifest.name).toBe('Data category tweaks');
        });

        test('should have a description', () => {
            expect(typeof manifest.description).toBe('string');
            expect(manifest.description.length).toBeGreaterThan(0);
        });

        test('should have tags array', () => {
            expect(Array.isArray(manifest.tags)).toBe(true);
        });
    });

    describe('enabledByDefault property', () => {
        test('should be enabled by default', () => {
            expect(manifest.enabledByDefault).toBe(true);
        });

        test('should be a boolean', () => {
            expect(typeof manifest.enabledByDefault).toBe('boolean');
        });

        test('should have changed from false to true (regression test)', () => {
            // This test documents the intentional change
            // Previous value was false, now it's true
            expect(manifest.enabledByDefault).not.toBe(false);
            expect(manifest.enabledByDefault).toBe(true);
        });
    });

    describe('tags', () => {
        test('should include "recommended" tag', () => {
            expect(manifest.tags).toContain('recommended');
        });

        test('should have at least one tag', () => {
            expect(manifest.tags.length).toBeGreaterThan(0);
        });

        test('should have all string tags', () => {
            manifest.tags.forEach(tag => {
                expect(typeof tag).toBe('string');
            });
        });
    });

    describe('manifest export', () => {
        test('should be a valid object', () => {
            expect(typeof manifest).toBe('object');
            expect(manifest).not.toBeNull();
        });

        test('should be immutable-safe (not frozen, but predictable)', () => {
            const originalValue = manifest.enabledByDefault;
            expect(originalValue).toBe(true);
        });
    });

    describe('integration with addon system', () => {
        test('should have valid manifest structure for addon loader', () => {
            // Verify the manifest has the structure expected by the addon system
            expect(manifest).toMatchObject({
                name: expect.any(String),
                description: expect.any(String),
                tags: expect.any(Array),
                enabledByDefault: expect.any(Boolean)
            });
        });

        test('should be automatically enabled on fresh installations', () => {
            // When enabledByDefault is true, the addon should be active without user action
            expect(manifest.enabledByDefault).toBe(true);
        });
    });

    describe('edge cases', () => {
        test('should handle undefined tags gracefully', () => {
            expect(manifest.tags).toBeDefined();
        });

        test('should not have null values in critical fields', () => {
            expect(manifest.name).not.toBeNull();
            expect(manifest.description).not.toBeNull();
            expect(manifest.enabledByDefault).not.toBeNull();
        });

        test('should have consistent property types', () => {
            const manifestKeys = Object.keys(manifest);
            expect(manifestKeys.length).toBeGreaterThan(0);
            
            // Verify no undefined properties
            manifestKeys.forEach(key => {
                expect(manifest[key]).toBeDefined();
            });
        });
    });

    describe('backwards compatibility', () => {
        test('should maintain expected manifest interface', () => {
            // Ensure the manifest maintains its interface for backward compatibility
            const requiredFields = ['name', 'description', 'tags', 'enabledByDefault'];
            requiredFields.forEach(field => {
                expect(manifest).toHaveProperty(field);
            });
        });
    });
});