import React from 'react';
import PropTypes from 'prop-types';
import VM from 'scratch-vm';
import Prompt from '../../containers/prompt.jsx';
import AddonHooks from '../../addons/hooks.js';
import {Theme} from '../../lib/themes';
import styles from './nanoscript-editor.css';

function NanoscriptEditor({ theme, vm }) {
    const el = React.useRef(null);
    const editorRef = React.useRef(null);
    const variableRef = React.useRef([]);
    const listsRef = React.useRef([]);
    const spriteOnlyVariablesRef = React.useRef([]);
    const spriteOnlyListsRef = React.useRef([]);
    const [, setVarsState] = React.useState([]); // used to trigger renders

    React.useEffect(() => {
        let disposed = false;

        async function loadEditor() {
            const {
                EditorView,
                basicSetup,
                HighlightStyle,
                syntaxHighlighting,
                tags,
                autocompletion,
                completeFromList
            } = await import(/*webpackChunkName: "nanoscript-editor"*/ "./ob-codemirror-imports.js");

            // Define hghlight rules using CSS vars
            const scratchHighlight = HighlightStyle.define([
                { tag: tags.variableName, color: "var(--data-primary)" },
                { tag: tags.keyword, color: "var(--pen-primary)" },
                { tag: tags.string, color: "var(--cm-string)" },
                { tag: tags.number, color: "var(--cm-number)" },
                { tag: tags.function, color: "var(--cm-function)" },
                { tag: tags.operator, color: "var(--cm-operator)" }
            ]);

            const { StreamLanguage } = await import("@codemirror/language");
            // helper to escape regex
            const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const scratchSyntax = StreamLanguage.define({
                token(stream) {
                    // Keywords
                    if (stream.match(/\b(when .*|say|repeat|if|else|forever|stop|broadcast|end)\b/)) return "keyword";
                    // Operators
                    if (stream.match(/\b(and|or|not|join|\+|\-|\*|\/|(abs|sin|cos) of .*)\b/)) return "operator";
                    // Functions
                    if (stream.match(/\b(join|pick random|length of)\b/)) return "function";

                    // Try to match variable or list names (take current refs)
                    const names = (variableRef.current || []).concat(listsRef.current || []);
                    if (names && names.length) {
                        // sort by length to match longest first
                        const sorted = names.slice().sort((a, b) => b.length - a.length).map(escapeRegExp);
                        const rx = new RegExp('^(' + sorted.join('|') + ')', 'i');
                        const m = stream.match(rx, true);
                        if (m) {
                            return "variableName";
                        }
                    }
                    stream.next();
                    return "variable";
                }
            });

            // NanoScript autocomplete suggestions (static)
            const staticCompletions = [
                // Control flow keywords
                { label: "when flag clicked", type: "keyword" },
                { label: "when key pressed", type: "keyword" },
                { label: "when this sprite clicked", type: "keyword" },
                { label: "when I start as a clone", type: "keyword" },
                { label: "forever", type: "keyword" },
                { label: "repeat", type: "keyword" },
                { label: "if", type: "keyword" },
                { label: "else", type: "keyword" },
                { label: "end", type: "keyword" },
                { label: "wait", type: "keyword" },
                { label: "stop", type: "keyword" },
                
                // Motion blocks
                { label: "move", type: "function" },
                { label: "turn right", type: "function" },
                { label: "turn left", type: "function" },
                { label: "go to", type: "function" },
                { label: "glide to", type: "function" },
                { label: "point in direction", type: "function" },
                { label: "point towards", type: "function" },
                { label: "change x by", type: "function" },
                { label: "set x to", type: "function" },
                { label: "change y by", type: "function" },
                { label: "set y to", type: "function" },
                
                // Looks blocks
                { label: "say", type: "function" },
                { label: "think", type: "function" },
                { label: "show", type: "function" },
                { label: "hide", type: "function" },
                { label: "switch costume to", type: "function" },
                { label: "next costume", type: "function" },
                { label: "change size by", type: "function" },
                { label: "set size to", type: "function" },
                { label: "change color effect by", type: "function" },
                { label: "set color effect to", type: "function" },
                { label: "clear graphic effects", type: "function" },
                
                // Sound blocks
                { label: "play sound", type: "function" },
                { label: "stop all sounds", type: "function" },
                { label: "change volume by", type: "function" },
                { label: "set volume to", type: "function" },
                
                // Events
                { label: "broadcast", type: "function" },
                { label: "broadcast and wait", type: "function" },
                { label: "when I receive", type: "keyword" },
                
                // Variables and lists
                { label: "set variable to", type: "function" },
                { label: "change variable by", type: "function" },
                { label: "add to list", type: "function" },
                { label: "delete from list", type: "function" },
                { label: "insert into list", type: "function" },
                { label: "replace list item", type: "function" },
                
                // Operators
                { label: "and", type: "operator" },
                { label: "or", type: "operator" },
                { label: "not", type: "operator" },
                { label: "join", type: "function" },
                { label: "letter of", type: "function" },
                { label: "length of", type: "function" },
                { label: "round", type: "function" },
                { label: "abs of", type: "function" },
                { label: "floor of", type: "function" },
                { label: "ceiling of", type: "function" },
                { label: "sqrt of", type: "function" },
                { label: "sin of", type: "function" },
                { label: "cos of", type: "function" },
                { label: "tan of", type: "function" },
                { label: "asin of", type: "function" },
                { label: "acos of", type: "function" },
                { label: "atan of", type: "function" },
                { label: "pick random", type: "function" },
                
                // Sensing blocks
                { label: "touching", type: "function" },
                { label: "touching color", type: "function" },
                { label: "color is touching", type: "function" },
                { label: "ask", type: "function" },
                { label: "key pressed", type: "function" },
                { label: "mouse down", type: "function" },
                { label: "distance to", type: "function" },
            ];

            // Function to get completions with prefix matching (dynamic includes variables & lists)
            function scratchCompletions(context) {
                const word = context.matchBefore(/\w*/);
                if (!word || (word.from === word.to && !context.explicit)) {
                    return null;
                }

                const dynamicVars = (variableRef.current || []).map(v => ({ label: v, type: 'variable', info: 'Variable' }));
                const dynamicLists = (listsRef.current || []).map(l => ({ label: l, type: 'variable', info: 'List' }));
                const allOptions = staticCompletions.concat(dynamicVars, dynamicLists);

                return {
                    from: word.from,
                    options: allOptions.filter(option =>
                        option.label.toLowerCase().startsWith(word.text.toLowerCase())
                    ),
                    validFor: /\w*/
                };
            }

            if (!el.current || disposed) return;

            const cmTheme = EditorView.theme({
                "&": {
                    backgroundColor: "var(--ui-white)",
                    color: "var(--text-primary)",
                    height: "100%",
                    borderTopRightRadius: "var(--space)",
                    borderBottomRightRadius: "var(--space)",
                    border: "1px solid var(--ui-black-transparent)",
                    height: "100%",
                },
                ".cm-scroller": {
                    maxHeight: "100%",
                    overflow: "auto"
                },
                ".cm-content": { caretColor: "var(--looks-secondary)" },
                ".cm-cursor": { borderLeft: "2px solid var(--looks-secondary)" },
                ".cm-focused": { outline: "none" },
                ".cm-selectionBackground, ::selection": { backgroundColor: "rgba(255, 140, 26, 0.3)" },
                ".cm-gutters": {
                    backgroundColor: "var(--ui-tertiary)",
                    borderRight: "1px solid var(--ui-black-transparent)"
                },
                ".cm-completionLabel": {
                    fontSize: "13px"
                }
            }, { dark: theme.isDark() ?? false });

            editorRef.current = new EditorView({
                doc: `when flag clicked
say "Hello World!"
repeat 10
    say (join "hi " "there")
end`,
                extensions: [
                    basicSetup,
                    scratchSyntax,
                    syntaxHighlighting(scratchHighlight),
                    autocompletion({ override: [scratchCompletions] }),
                    cmTheme
                ],
                parent: el.current
            });
        }

        loadEditor();

        return () => {
            disposed = true;
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, [theme]);

    // Update variable/list refs from VM and listen for changes
    React.useEffect(() => {
        if (!vm) return undefined;

        function updateVarsLists () {
            try {
                const editing = vm.editingTarget || vm.runtime.getTargetForStage();
                if (!editing) {
                    variableRef.current = [];
                    listsRef.current = [];
                    spriteOnlyVariablesRef.current = [];
                    spriteOnlyListsRef.current = [];
                    setVarsState([]);
                    return;
                }

                const isStage = editing.isStage;
                let spriteVars = isStage ? [] : (editing.getAllVariableNamesInScopeByType('', true) || []);
                let spriteLists = isStage ? [] : (editing.getAllVariableNamesInScopeByType('list', true) || []);
                let stageVars = [];
                let stageLists = [];
                
                // Get stage variables
                const stage = vm.runtime.getTargetForStage();
                if (stage) {
                    stageVars = stage.getAllVariableNamesInScopeByType('') || [];
                    stageLists = stage.getAllVariableNamesInScopeByType('list') || [];
                }
                
                // For stage: only show stage variables
                // For sprite: show stage variables in "For all sprites", sprite-only in "For this sprite only"
                if (isStage) {
                    variableRef.current = stageVars;
                    listsRef.current = stageLists;
                    spriteOnlyVariablesRef.current = [];
                    spriteOnlyListsRef.current = [];
                } else {
                    variableRef.current = stageVars;
                    listsRef.current = stageLists;
                    spriteOnlyVariablesRef.current = spriteVars;
                    spriteOnlyListsRef.current = spriteLists;
                }
                
                // trigger render
                setVarsState(variableRef.current.slice());
            } catch (e) {
                // ignore
            }
        }

        updateVarsLists();
        vm.on('targetsUpdate', updateVarsLists);
        vm.on('PROJECT_CHANGED', updateVarsLists);
        return () => {
            vm.off('targetsUpdate', updateVarsLists);
            vm.off('PROJECT_CHANGED', updateVarsLists);
        };
    }, [vm]);

    // handlers for make variable/list and inserting into editor
    const [promptProps, setPromptProps] = React.useState(null);

    const makeVariable = (type = '') => {
        if (!vm) {
            alert('VM not available');
            return;
        }

        // Determine editing target and stage status
        const editing = vm.editingTarget || vm.runtime.getTargetForStage();
        const isStage = editing && editing.isStage;

        // Compute props for Prompt component similar to Blocks.handlePromptStart
        const title = type === 'list' ? 'Make a List' : 'Make a Variable';
        const varTypeConst = type === 'list' ? 'list' : '';
        const showListMessage = type === 'list';
        const showCloudOption = (varTypeConst === '') && (vm.runtime && typeof vm.runtime.canAddCloudVariable === 'function' ? vm.runtime.canAddCloudVariable() : false);

        setPromptProps({
            defaultValue: '',
            isStage: !!(editing && editing.isStage),
            showListMessage,
            label: type === 'list' ? 'List name' : 'Variable name',
            showCloudOption,
            showVariableOptions: true,
            title,
            varType: varTypeConst
        });
    };

    const insertIntoEditor = name => {
        if (!editorRef.current) return;
        try {
            const view = editorRef.current;
            const pos = view.state.selection.main.head;
            view.dispatch({changes: {from: pos, insert: name}});
            view.focus();
        } catch (e) {
            // ignore
        }
    };

    const handlePromptCancel = () => setPromptProps(null);
    const handlePromptOk = (input, variableOptions) => {
        try {
            const varType = (promptProps && promptProps.varType) || '';
            let allVarNames = [];
            if (vm && vm.runtime && typeof vm.runtime.getAllVarNamesOfType === 'function') {
                try {
                    allVarNames = vm.runtime.getAllVarNamesOfType(varType) || [];
                } catch (e) {
                    allVarNames = [];
                }
            }
            const editing = vm.editingTarget || (vm.runtime && vm.runtime.getTargetForStage && vm.runtime.getTargetForStage());
            if (editing && !editing.isStage && vm.runtime && typeof vm.runtime.getTargetForStage === 'function') {
                try {
                    const stage = vm.runtime.getTargetForStage();
                    if (stage && typeof stage.getAllVariableNamesInScopeByType === 'function') {
                        const stageVars = stage.getAllVariableNamesInScopeByType(varType) || [];
                        for (const s of stageVars) {
                            if (!allVarNames.includes(s)) allVarNames.push(s);
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }

            const ws = AddonHooks.blocklyWorkspace;
            const isLocal = variableOptions && variableOptions.scope === 'local';
            const isCloud = !!(variableOptions && variableOptions.isCloud);
            if (ws && typeof ws.createVariable === 'function') {
                try {
                    ws.createVariable(input, varType, null, !!isLocal, !!isCloud);
                } catch (e) {
                    // ignore
                }
            }
        } finally {
            setPromptProps(null);
        }
    };

    return <div style={{display: 'flex', height: '100%', width: '100%'}}>
        {promptProps ? (
            <Prompt
                defaultValue={promptProps.defaultValue}
                isStage={promptProps.isStage}
                showListMessage={promptProps.showListMessage}
                label={promptProps.label}
                showCloudOption={promptProps.showCloudOption}
                showVariableOptions={promptProps.showVariableOptions}
                title={promptProps.title}
                vm={vm}
                onCancel={handlePromptCancel}
                onOk={handlePromptOk}
            />
        ) : null}
        <div className={styles.sidebar}>
            <h2>Variables</h2>
            
            <h3>For all sprites</h3>
            <div className={styles.varsList}>
                {(variableRef.current || []).map(v => (
                    <button
                        key={`var-${v}`}
                        className={styles.varItem}
                        onClick={() => insertIntoEditor(v)}
                    >{v}</button>
                ))}
            </div>
            {spriteOnlyVariablesRef.current && spriteOnlyVariablesRef.current.length > 0 && (
                <>
                    <h3 style={{marginTop: 12}}>For this sprite only</h3>
                    <div className={styles.varsList}>
                        {spriteOnlyVariablesRef.current.map(v => (
                            <button
                                key={`var-sprite-${v}`}
                                className={styles.varItem}
                                onClick={() => insertIntoEditor(v)}
                            >{v}</button>
                        ))}
                    </div>
                </>
            )}
            <div style={{marginTop: 8}}>
                <button className={styles.button} onClick={() => makeVariable('')}>Make a Variable</button>
            </div>

            <h2 style={{marginTop: 16}}>Lists</h2>
            
            <h3>For all sprites</h3>
            <div className={styles.varsList}>
                {(listsRef.current || []).map(l => (
                    <button
                        key={`list-${l}`}
                        className={styles.varItem}
                        onClick={() => insertIntoEditor(l)}
                    >{l}</button>
                ))}
            </div>
            {spriteOnlyListsRef.current && spriteOnlyListsRef.current.length > 0 && (
                <>
                    <h3 style={{marginTop: 12}}>For this sprite only</h3>
                    <div className={styles.varsList}>
                        {spriteOnlyListsRef.current.map(l => (
                            <button
                                key={`list-sprite-${l}`}
                                className={styles.varItem}
                                onClick={() => insertIntoEditor(l)}
                            >{l}</button>
                        ))}
                    </div>
                </>
            )}
            <div style={{marginTop: 8}}>
                <button className={styles.button} onClick={() => makeVariable('list')}>Make a List</button>
            </div>
        </div>
        <div ref={el} className={styles.codemirror} style={{height: '100%', flex: 1}} />
    </div>;
}

NanoscriptEditor.propTypes = {
    theme: PropTypes.instanceOf(Theme),
    vm: PropTypes.instanceOf(VM).isRequired
};

export default NanoscriptEditor;
