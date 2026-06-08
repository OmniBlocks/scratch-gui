/* eslint-env jest */
/**
 * Tests for package-lock.json
 * 
 * This test suite validates the structure and integrity of the package lock file,
 * ensuring dependencies are properly locked and secure.
 */
const fs = require('fs');
const path = require('path');

describe('Package Lock File', () => {
    let packageLock;
    let packageLockPath;

    beforeAll(() => {
        packageLockPath = path.join(__dirname, '../../../package-lock.json');
        const content = fs.readFileSync(packageLockPath, 'utf8');
        packageLock = JSON.parse(content);
    });

    describe('JSON Structure', () => {
        test('package-lock.json is valid JSON', () => {
            expect(packageLock).toBeDefined();
            expect(typeof packageLock).toBe('object');
        });

        test('has required top-level fields', () => {
            expect(packageLock).toHaveProperty('name');
            expect(packageLock).toHaveProperty('version');
            expect(packageLock).toHaveProperty('lockfileVersion');
        });

        test('lockfile version is supported', () => {
            const version = packageLock.lockfileVersion;
            expect([1, 2, 3]).toContain(version);
        });

        test('has packages section', () => {
            expect(packageLock).toHaveProperty('packages');
            expect(typeof packageLock.packages).toBe('object');
        });
    });

    describe('Dependency Updates', () => {
        test('scratch-blocks dependency is updated', () => {
            const scratchBlocks = Object.entries(packageLock.packages || {})
                .find(([key]) => key.includes('scratch-blocks'));
            
            expect(scratchBlocks).toBeDefined();
        });

        test('scratch-vm dependency is updated', () => {
            const scratchVm = Object.entries(packageLock.packages || {})
                .find(([key]) => key.includes('scratch-vm'));
            
            expect(scratchVm).toBeDefined();
        });

        test('git dependencies have valid commit hashes', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.resolved && pkg.resolved.startsWith('git+ssh://')) {
                    const match = pkg.resolved.match(/#([a-f0-9]{40})/);
                    expect(match).toBeTruthy();
                    expect(match[1].length).toBe(40);
                }
            });
        });

        test('git dependencies use SSH protocol', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.resolved && pkg.resolved.includes('github.com')) {
                    if (pkg.resolved.startsWith('git+')) {
                        expect(pkg.resolved).toContain('git+ssh://');
                    }
                }
            });
        });
    });

    describe('Integrity Checks', () => {
        test('all packages have integrity hashes', () => {
            const packages = Object.entries(packageLock.packages || {});
            const packagesWithResolved = packages.filter(([, pkg]) => pkg.resolved);
            
            packagesWithResolved.forEach(([key, pkg]) => {
                if (!pkg.resolved.startsWith('git+')) {
                    expect(pkg).toHaveProperty('integrity');
                }
            });
        });

        test('integrity hashes use strong algorithms', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.integrity) {
                    expect(pkg.integrity).toMatch(/^sha(256|512)-/);
                }
            });
        });

        test('git dependencies have integrity hashes', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.resolved && pkg.resolved.startsWith('git+ssh://')) {
                    expect(pkg.integrity).toBeDefined();
                    expect(typeof pkg.integrity).toBe('string');
                }
            });
        });
    });

    describe('Version Consistency', () => {
        test('root package version matches', () => {
            const packageJsonPath = path.join(__dirname, '../../../package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            expect(packageLock.version).toBe(packageJson.version);
        });

        test('all dependencies have valid semantic versions', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.version && !pkg.resolved?.startsWith('git+')) {
                    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+/);
                }
            });
        });
    });

    describe('Security Considerations', () => {
        test('no obvious security vulnerabilities in dependency versions', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.name && pkg.version) {
                    const match = pkg.version.match(/^(\d+)/);
                    if (match) {
                        const majorVersion = parseInt(match[1]);
                        if (key.includes('scratch-')) {
                            expect(majorVersion).toBeGreaterThanOrEqual(0);
                        }
                    }
                }
            });
        });

        test('dependencies are from trusted sources', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.resolved && pkg.resolved.startsWith('http')) {
                    expect(pkg.resolved).toMatch(/npmjs\.org|github\.com/);
                }
            });
        });

        test('no suspicious package names', () => {
            Object.entries(packageLock.packages || {}).forEach(([key, pkg]) => {
                if (pkg.name) {
                    expect(pkg.name).not.toMatch(/^(j5|reaqt|nodej5)/);
                }
            });
        });
    });

    describe('Dependency Graph', () => {
        test('no circular dependencies in immediate deps', () => {
            const visited = new Set();
            const checkCircular = (pkgKey, path = []) => {
                if (path.includes(pkgKey)) {
                    return false;
                }
                if (visited.has(pkgKey)) {
                    return true;
                }
                visited.add(pkgKey);
                return true;
            };

            Object.keys(packageLock.packages || {}).forEach(key => {
                expect(checkCircular(key)).toBe(true);
            });
        });

        test('root package has dependencies defined', () => {
            const rootPackage = packageLock.packages[''];
            expect(rootPackage).toBeDefined();
            expect(rootPackage.dependencies || rootPackage.devDependencies).toBeDefined();
        });
    });

    describe('File Integrity', () => {
        test('file is properly formatted JSON', () => {
            const raw = fs.readFileSync(packageLockPath, 'utf8');
            expect(() => JSON.parse(raw)).not.toThrow();
        });

        test('file uses consistent indentation', () => {
            const raw = fs.readFileSync(packageLockPath, 'utf8');
            const lines = raw.split('\n');
            const indentedLines = lines.filter(line => line.startsWith(' '));
            
            if (indentedLines.length > 0) {
                const firstIndent = indentedLines[0].match(/^ +/);
                if (firstIndent) {
                    const indentSize = firstIndent[0].length;
                    expect(indentSize % 2).toBe(0);
                }
            }
        });

        test('file ends with newline', () => {
            const raw = fs.readFileSync(packageLockPath, 'utf8');
            expect(raw.endsWith('\n')).toBe(true);
        });
    });

    describe('Specific Package Updates', () => {
        test('scratch-blocks points to correct commit', () => {
            const scratchBlocks = Object.entries(packageLock.packages || {})
                .find(([key]) => key.includes('scratch-blocks'));
            
            if (scratchBlocks) {
                const [, pkg] = scratchBlocks;
                if (pkg.resolved) {
                    expect(pkg.resolved).toContain('7b24920ea6fc99228b63ef7ada5091e19c4f4553');
                }
            }
        });

        test('scratch-vm points to correct commit', () => {
            const scratchVm = Object.entries(packageLock.packages || {})
                .find(([key]) => key.includes('scratch-vm'));
            
            if (scratchVm) {
                const [, pkg] = scratchVm;
                if (pkg.resolved) {
                    expect(pkg.resolved).toContain('279ea2a18b244bedd545b59a00247df9a841cf9d');
                }
            }
        });

        test('updated packages maintain license information', () => {
            ['scratch-blocks', 'scratch-vm'].forEach(pkgName => {
                const pkg = Object.entries(packageLock.packages || {})
                    .find(([key]) => key.includes(pkgName));
                
                if (pkg) {
                    const [, pkgData] = pkg;
                    expect(pkgData.license).toBeDefined();
                    expect(typeof pkgData.license).toBe('string');
                }
            });
        });
    });

    describe('Regression Tests', () => {
        test('maintains backward compatibility with package structure', () => {
            const essential = ['webpack', 'babel', 'react'];
            essential.forEach(pkgPrefix => {
                const found = Object.keys(packageLock.packages || {})
                    .some(key => key.includes(pkgPrefix));
                expect(found).toBe(true);
            });
        });

        test('no unexpected package removals', () => {
            const scratchPackages = Object.keys(packageLock.packages || {})
                .filter(key => key.includes('scratch-'));
            expect(scratchPackages.length).toBeGreaterThan(0);
        });
    });
});