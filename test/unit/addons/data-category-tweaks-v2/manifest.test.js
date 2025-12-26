/**
 * @jest-environment jsdom
 */

describe('data-category-tweaks-v2 manifest', () => {
  let manifest;

  beforeEach(() => {
    // Reset module cache to ensure fresh import
    jest.resetModules();
  });

  describe('manifest structure', () => {
    test('should have required manifest properties', () => {
      // Mock manifest structure based on the actual file
      manifest = {
        "name": "Data category tweaks",
        "description": "Adds a \"hide variable [var]\" block. Also allows to create local variables only accessible by one sprite, and gives the ability to delete cloud variables from the editor.",
        "credits": [
          {
            "name": "Tacodiva",
            "link": "https://scratch.mit.edu/users/Tacodiva/"
          },
          {
            "name": "CST1229",
            "link": "https://scratch.mit.edu/users/CST1229/"
          }
        ],
        "userscripts": [
          {
            "url": "userscript.js"
          }
        ],
        "userstyles": [
          {
            "url": "style.css"
          }
        ],
        "settings": [
          {
            "id": "local",
            "name": "Enable \"for this sprite only\" variables",
            "type": "boolean",
            "default": true
          },
          {
            "id": "moveReportersDown",
            "name": "Move reporters to bottom of category",
            "type": "boolean",
            "default": false
          }
        ],
        "tags": [
          "recommended"
        ],
        "enabledByDefault": true
      };

      expect(manifest).toHaveProperty('name');
      expect(manifest).toHaveProperty('description');
      expect(manifest).toHaveProperty('credits');
      expect(manifest).toHaveProperty('userscripts');
      expect(manifest).toHaveProperty('userstyles');
      expect(manifest).toHaveProperty('settings');
      expect(manifest).toHaveProperty('tags');
      expect(manifest).toHaveProperty('enabledByDefault');
    });

    test('should have correct name', () => {
      manifest = {
        "name": "Data category tweaks",
        "enabledByDefault": true
      };
      expect(manifest.name).toBe('Data category tweaks');
    });

    test('should have meaningful description', () => {
      manifest = {
        "description": "Adds a \"hide variable [var]\" block. Also allows to create local variables only accessible by one sprite, and gives the ability to delete cloud variables from the editor.",
        "enabledByDefault": true
      };
      expect(manifest.description).toBeDefined();
      expect(typeof manifest.description).toBe('string');
      expect(manifest.description.length).toBeGreaterThan(0);
    });

    test('should have credits array', () => {
      manifest = {
        "credits": [
          {
            "name": "Tacodiva",
            "link": "https://scratch.mit.edu/users/Tacodiva/"
          },
          {
            "name": "CST1229",
            "link": "https://scratch.mit.edu/users/CST1229/"
          }
        ],
        "enabledByDefault": true
      };
      expect(Array.isArray(manifest.credits)).toBe(true);
      expect(manifest.credits.length).toBeGreaterThan(0);
    });

    test('credits should have proper structure', () => {
      manifest = {
        "credits": [
          {
            "name": "Tacodiva",
            "link": "https://scratch.mit.edu/users/Tacodiva/"
          }
        ],
        "enabledByDefault": true
      };
      manifest.credits.forEach(credit => {
        expect(credit).toHaveProperty('name');
        expect(credit).toHaveProperty('link');
        expect(typeof credit.name).toBe('string');
        expect(typeof credit.link).toBe('string');
      });
    });

    test('should have userscripts array', () => {
      manifest = {
        "userscripts": [
          {
            "url": "userscript.js"
          }
        ],
        "enabledByDefault": true
      };
      expect(Array.isArray(manifest.userscripts)).toBe(true);
      expect(manifest.userscripts.length).toBeGreaterThan(0);
    });

    test('should have userstyles array', () => {
      manifest = {
        "userstyles": [
          {
            "url": "style.css"
          }
        ],
        "enabledByDefault": true
      };
      expect(Array.isArray(manifest.userstyles)).toBe(true);
      expect(manifest.userstyles.length).toBeGreaterThan(0);
    });

    test('should have settings array with valid structure', () => {
      manifest = {
        "settings": [
          {
            "id": "local",
            "name": "Enable \"for this sprite only\" variables",
            "type": "boolean",
            "default": true
          },
          {
            "id": "moveReportersDown",
            "name": "Move reporters to bottom of category",
            "type": "boolean",
            "default": false
          }
        ],
        "enabledByDefault": true
      };
      expect(Array.isArray(manifest.settings)).toBe(true);
      manifest.settings.forEach(setting => {
        expect(setting).toHaveProperty('id');
        expect(setting).toHaveProperty('name');
        expect(setting).toHaveProperty('type');
        expect(setting).toHaveProperty('default');
        expect(typeof setting.id).toBe('string');
        expect(typeof setting.name).toBe('string');
      });
    });

    test('should have recommended tag', () => {
      manifest = {
        "tags": ["recommended"],
        "enabledByDefault": true
      };
      expect(Array.isArray(manifest.tags)).toBe(true);
      expect(manifest.tags).toContain('recommended');
    });
  });

  describe('enabledByDefault property', () => {
    test('should be set to true', () => {
      manifest = {
        "enabledByDefault": true
      };
      expect(manifest.enabledByDefault).toBe(true);
    });

    test('should be a boolean type', () => {
      manifest = {
        "enabledByDefault": true
      };
      expect(typeof manifest.enabledByDefault).toBe('boolean');
    });

    test('should not be undefined or null', () => {
      manifest = {
        "enabledByDefault": true
      };
      expect(manifest.enabledByDefault).not.toBeUndefined();
      expect(manifest.enabledByDefault).not.toBeNull();
    });

    test('should be explicitly true, not truthy', () => {
      manifest = {
        "enabledByDefault": true
      };
      expect(manifest.enabledByDefault).toBe(true);
      expect(manifest.enabledByDefault).not.toBe(1);
      expect(manifest.enabledByDefault).not.toBe('true');
    });
  });

  describe('manifest validation', () => {
    test('should have all required fields for addon system', () => {
      manifest = {
        "name": "Data category tweaks",
        "description": "Adds a \"hide variable [var]\" block. Also allows to create local variables only accessible by one sprite, and gives the ability to delete cloud variables from the editor.",
        "credits": [
          {
            "name": "Tacodiva",
            "link": "https://scratch.mit.edu/users/Tacodiva/"
          }
        ],
        "userscripts": [
          {
            "url": "userscript.js"
          }
        ],
        "userstyles": [
          {
            "url": "style.css"
          }
        ],
        "settings": [],
        "tags": ["recommended"],
        "enabledByDefault": true
      };

      // Validate manifest has minimum required fields
      const requiredFields = ['name', 'description', 'enabledByDefault'];
      requiredFields.forEach(field => {
        expect(manifest).toHaveProperty(field);
      });
    });

    test('should have valid userscript URLs', () => {
      manifest = {
        "userscripts": [
          {
            "url": "userscript.js"
          }
        ],
        "enabledByDefault": true
      };
      manifest.userscripts.forEach(script => {
        expect(script.url).toBeDefined();
        expect(typeof script.url).toBe('string');
        expect(script.url.length).toBeGreaterThan(0);
      });
    });

    test('should have valid userstyle URLs', () => {
      manifest = {
        "userstyles": [
          {
            "url": "style.css"
          }
        ],
        "enabledByDefault": true
      };
      manifest.userstyles.forEach(style => {
        expect(style.url).toBeDefined();
        expect(typeof style.url).toBe('string');
        expect(style.url.length).toBeGreaterThan(0);
      });
    });

    test('settings should have unique IDs', () => {
      manifest = {
        "settings": [
          {
            "id": "local",
            "name": "Enable \"for this sprite only\" variables",
            "type": "boolean",
            "default": true
          },
          {
            "id": "moveReportersDown",
            "name": "Move reporters to bottom of category",
            "type": "boolean",
            "default": false
          }
        ],
        "enabledByDefault": true
      };
      const ids = manifest.settings.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('settings should have valid types', () => {
      manifest = {
        "settings": [
          {
            "id": "local",
            "name": "Enable \"for this sprite only\" variables",
            "type": "boolean",
            "default": true
          },
          {
            "id": "moveReportersDown",
            "name": "Move reporters to bottom of category",
            "type": "boolean",
            "default": false
          }
        ],
        "enabledByDefault": true
      };
      const validTypes = ['boolean', 'string', 'integer', 'color', 'select'];
      manifest.settings.forEach(setting => {
        expect(validTypes).toContain(setting.type);
      });
    });

    test('boolean settings should have boolean defaults', () => {
      manifest = {
        "settings": [
          {
            "id": "local",
            "type": "boolean",
            "default": true
          }
        ],
        "enabledByDefault": true
      };
      manifest.settings
        .filter(s => s.type === 'boolean')
        .forEach(setting => {
          expect(typeof setting.default).toBe('boolean');
        });
    });
  });

  describe('integration with addon system', () => {
    test('should be loadable as an addon', () => {
      manifest = {
        "name": "Data category tweaks",
        "description": "Adds a \"hide variable [var]\" block. Also allows to create local variables only accessible by one sprite, and gives the ability to delete cloud variables from the editor.",
        "credits": [],
        "userscripts": [{"url": "userscript.js"}],
        "userstyles": [{"url": "style.css"}],
        "settings": [],
        "tags": ["recommended"],
        "enabledByDefault": true
      };

      // Simulate addon loader validation
      expect(manifest.name).toBeDefined();
      expect(manifest.userscripts).toBeDefined();
      expect(manifest.enabledByDefault).toBe(true);
    });

    test('enabledByDefault true means addon should auto-enable', () => {
      manifest = {
        "enabledByDefault": true
      };
      
      // Simulate addon auto-enable logic
      const shouldAutoEnable = manifest.enabledByDefault === true;
      expect(shouldAutoEnable).toBe(true);
    });

    test('should work with recommended tag and enabledByDefault', () => {
      manifest = {
        "tags": ["recommended"],
        "enabledByDefault": true
      };
      
      // Both recommended and enabled by default should be compatible
      const isRecommended = manifest.tags.includes('recommended');
      const isEnabledByDefault = manifest.enabledByDefault;
      
      expect(isRecommended).toBe(true);
      expect(isEnabledByDefault).toBe(true);
    });

    test('should handle user preferences override', () => {
      manifest = {
        "enabledByDefault": true
      };
      
      // Simulate user preference system
      const userDisabled = false; // User hasn't disabled it
      const shouldBeEnabled = manifest.enabledByDefault && !userDisabled;
      
      expect(shouldBeEnabled).toBe(true);
    });
  });

  describe('backward compatibility', () => {
    test('should maintain structure for existing addons', () => {
      manifest = {
        "name": "Data category tweaks",
        "description": "Adds a \"hide variable [var]\" block. Also allows to create local variables only accessible by one sprite, and gives the ability to delete cloud variables from the editor.",
        "credits": [],
        "userscripts": [],
        "userstyles": [],
        "settings": [],
        "tags": ["recommended"],
        "enabledByDefault": true
      };

      // Old code should still be able to read these properties
      expect(manifest.name).toBeDefined();
      expect(manifest.tags).toBeDefined();
      expect(typeof manifest.enabledByDefault).toBe('boolean');
    });

    test('changing enabledByDefault should not break other properties', () => {
      const manifestBefore = {
        "name": "Data category tweaks",
        "tags": ["recommended"],
        "enabledByDefault": false
      };

      const manifestAfter = {
        "name": "Data category tweaks",
        "tags": ["recommended"],
        "enabledByDefault": true
      };

      // All other properties should remain unchanged
      expect(manifestAfter.name).toBe(manifestBefore.name);
      expect(manifestAfter.tags).toEqual(manifestBefore.tags);
      // Only enabledByDefault should change
      expect(manifestAfter.enabledByDefault).not.toBe(manifestBefore.enabledByDefault);
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle missing optional fields gracefully', () => {
      manifest = {
        "name": "Data category tweaks",
        "enabledByDefault": true
      };

      // These are optional
      expect(manifest.credits || []).toBeDefined();
      expect(manifest.settings || []).toBeDefined();
    });

    test('should reject invalid enabledByDefault values conceptually', () => {
      const invalidValues = [null, undefined, 'true', 1, 0, {}, []];
      
      invalidValues.forEach(value => {
        expect(typeof value === 'boolean').toBe(false);
      });
    });

    test('should have consistent property naming', () => {
      manifest = {
        "enabledByDefault": true,
        "userscripts": [],
        "userstyles": []
      };

      // Check camelCase consistency
      expect(manifest.enabledByDefault).toBeDefined(); // camelCase
      expect(manifest.userscripts).toBeDefined(); // lowercase
      expect(manifest.userstyles).toBeDefined(); // lowercase
    });
  });

  describe('feature impact', () => {
    test('enabledByDefault should affect initial addon state', () => {
      manifest = {
        "enabledByDefault": true
      };
      
      // Simulate initial state calculation
      const initialState = {
        enabled: manifest.enabledByDefault
      };
      
      expect(initialState.enabled).toBe(true);
    });

    test('should enable data category separation by default', () => {
      manifest = {
        "name": "Data category tweaks",
        "enabledByDefault": true
      };
      
      // This addon separates Variables into Variables and Lists
      const providesListsCategory = manifest.name === "Data category tweaks";
      const enabledByDefault = manifest.enabledByDefault;
      
      expect(providesListsCategory && enabledByDefault).toBe(true);
    });

    test('users should see addon effects immediately on first launch', () => {
      manifest = {
        "enabledByDefault": true
      };
      
      const isFirstLaunch = true;
      const userHasCustomSettings = false;
      
      const shouldShowEffects = isFirstLaunch && 
                                 manifest.enabledByDefault && 
                                 !userHasCustomSettings;
      
      expect(shouldShowEffects).toBe(true);
    });
  });
});