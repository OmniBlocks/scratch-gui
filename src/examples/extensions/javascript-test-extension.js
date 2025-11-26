/**
 * Example extension demonstrating the runJavaScript security permission
 */
class JavaScriptTestExtension {
    constructor() {
        this.runtime = null;
    }

    getInfo() {
        return {
            id: 'javascriptTest',
            name: 'JavaScript Test',
            blocks: [
                {
                    opcode: 'executeJavaScript',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'execute JavaScript: [CODE]',
                    arguments: {
                        CODE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'console.log("Hello from extension!")'
                        }
                    }
                },
                {
                    opcode: 'evaluateExpression',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'evaluate: [EXPRESSION]',
                    arguments: {
                        EXPRESSION: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '2 + 2'
                        }
                    }
                }
            ]
        };
    }

    async executeJavaScript(args) {
        // Request permission to run JavaScript
        const securityManager = this.runtime?.extensionManager?.securityManager;
        if (!securityManager) {
            throw new Error('Security manager not available - runtime not initialized');
        }
        
        if (!securityManager || !securityManager.canRunJavaScript) {
            throw new Error('Security manager not available or runJavaScript not supported');
        }

        const allowed = await securityManager.canRunJavaScript();
        if (!allowed) {
            throw new Error('JavaScript execution not permitted by user');
        }

        try {
            // Execute the JavaScript code
            // Note: In a real implementation, you might want to add additional safety measures
            // Validate that CODE parameter is provided
            if (typeof args.CODE !== 'string') {
                throw new Error('Invalid code parameter - must be a string');
            }
            eval(args.CODE);
        } catch (error) {
            console.error('JavaScript execution error:', error);
            throw error;
        }
    }

    async evaluateExpression(args) {
        // Request permission to run JavaScript
        const securityManager = this.runtime.extensionManager.securityManager;
        const securityManager = this.runtime?.extensionManager?.securityManager;
        if (!securityManager) {
            return 'Error: Security manager not available - runtime not initialized';
        }
        
            return 'Security manager not available';
        }

        const allowed = await securityManager.canRunJavaScript();
        if (!allowed) {
            return 'Permission denied';
        }

        try {
            // Evaluate the JavaScript expression and return the result
            if (typeof args.EXPRESSION !== 'string') {
                return 'Error: Invalid expression parameter - must be a string';
            }
            
            const result = eval(args.EXPRESSION);
            return String(result);
        } catch (error) {
            console.error('JavaScript evaluation error:', error);
            return `Error: ${error.message}`;
        }
    }
}

Scratch.extensions.register(new JavaScriptTestExtension());