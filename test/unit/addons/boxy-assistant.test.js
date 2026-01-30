/**
 * @jest-environment jsdom
 */

describe('Boxy Assistant Addon', () => {
    test('addon manifest exists and has correct structure', () => {
        const manifest = require('../../../src/addons/addons/boxy-assistant/_manifest_entry.js').default;
        
        expect(manifest).toBeDefined();
        expect(manifest.name).toBe('Boxy AI Assistant');
        expect(manifest.editorOnly).toBe(true);
        expect(manifest.noTranslations).toBe(true);
        expect(manifest.enabledByDefault).toBe(false);
        expect(manifest.tags).toContain('featured');
        expect(manifest.tags).toContain('new');
    });

    test('addon has required files defined', () => {
        const manifest = require('../../../src/addons/addons/boxy-assistant/_manifest_entry.js').default;
        
        expect(manifest.userscripts).toBeDefined();
        expect(manifest.userscripts.length).toBe(1);
        expect(manifest.userscripts[0].url).toBe('userscript.js');
        
        expect(manifest.userstyles).toBeDefined();
        expect(manifest.userstyles.length).toBe(1);
        expect(manifest.userstyles[0].url).toBe('style.css');
    });

    test('addon is registered in addons.js', () => {
        const addonsModule = require('../../../src/addons/addons.js');
        
        expect(addonsModule.addons).toContain('boxy-assistant');
        expect(addonsModule.newAddons).toContain('boxy-assistant');
    });

    test('addon has proper credits', () => {
        const manifest = require('../../../src/addons/addons/boxy-assistant/_manifest_entry.js').default;
        
        expect(manifest.credits).toBeDefined();
        expect(manifest.credits.length).toBeGreaterThan(0);
        expect(manifest.credits[0].name).toBe('supervoidcoder');
    });

    test('addon description is informative', () => {
        const manifest = require('../../../src/addons/addons/boxy-assistant/_manifest_entry.js').default;
        
        expect(manifest.description).toBeDefined();
        expect(manifest.description.length).toBeGreaterThan(50);
        expect(manifest.description).toContain('AI');
        expect(manifest.description).toContain('Boxy');
    });
});
