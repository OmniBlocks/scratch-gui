import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';
import SongsTab from '../../containers/songs-tab.jsx';
import Backpack from '../../containers/backpack.jsx';
import BrowserModal from '../browser-modal/browser-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';
import TWUsernameModal from '../../containers/tw-username-modal.jsx';
import TWSettingsModal from '../../containers/tw-settings-modal.jsx';
import TWSecurityManager from '../../containers/tw-security-manager.jsx';
import TWCustomExtensionModal from '../../containers/tw-custom-extension-modal.jsx';
import TWRestorePointManager from '../../containers/tw-restore-point-manager.jsx';
import TWFontsModal from '../../containers/tw-fonts-modal.jsx';
import TWUnknownPlatformModal from '../../containers/tw-unknown-platform-modal.jsx';
import TWInvalidProjectModal from '../../containers/tw-invalid-project-modal.jsx';

import {STAGE_SIZE_MODES, FIXED_WIDTH, UNCONSTRAINED_NON_STAGE_WIDTH} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';
import {Theme} from '../../lib/themes';
import AddonHooks from '../../addons/hooks.js';
import ToggleButtons from '../toggle-buttons/toggle-buttons.jsx';
import Prompt from '../../containers/prompt.jsx';
import nanoscriptIcon from '!../../lib/tw-recolor/build!./nanoscriptIcon.svg';

import {isRendererSupported, isBrowserSupported} from '../../lib/tw-environment-support-prober';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from '!../../lib/tw-recolor/build!./icon--code.svg';
import costumesIcon from '!../../lib/tw-recolor/build!./icon--costumes.svg';
import soundsIcon from '!../../lib/tw-recolor/build!./icon--sounds.svg';
import songsIcon from '!../../lib/tw-recolor/build!./icon--songs.svg';
import SpinnerComponent from '../tw-loading-spinner/spinner.jsx';
const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

const getFullscreenBackgroundColor = () => {
    const params = new URLSearchParams(location.search);
    if (params.has('fullscreen-background')) {
        return params.get('fullscreen-background');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return '#111';
    }
    return 'white';
};

const fullscreenBackgroundColor = getFullscreenBackgroundColor();

function CMView({ theme, vm }) {
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
                { label: "start sound", type: "function" },
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
            }, { dark: theme === Theme.dark });

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

    return <>
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
        <div ref={el} className={styles.codemirror} style={{height: '100%', width: '100%'}} />
    </>;
}

const GUIComponent = props => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksId,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canChangeTheme,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        customStageSize,
        enableCommunity,
        intl,
        isCreating,
        isEmbedded,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isWindowFullScreen,
        isTelemetryEnabled,
        isTotallyNormal,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onClickAddonSettings,
        onClickDesktopSettings,
        onClickNewWindow,
        onClickPackager,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateSongsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onOpenCustomExtensionModal,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        securityManager,
        showComingSoon,
        showOpenFilePicker,
        showSaveFilePicker,
        soundsTabVisible,
        songsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        theme,
        tipsLibraryVisible,
        usernameModalVisible,
        settingsModalVisible,
        customExtensionModalVisible,
        fontsModalVisible,
        unknownPlatformModalVisible,
        invalidProjectModalVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    const [isNano, setNano] = React.useState(false);

    const unconstrainedWidth = (
        UNCONSTRAINED_NON_STAGE_WIDTH +
        FIXED_WIDTH +
        Math.max(0, customStageSize.width - FIXED_WIDTH)
    );
    return (<MediaQuery minWidth={unconstrainedWidth}>{isUnconstrained => {
        const stageSize = resolveStageSize(stageSizeMode, isUnconstrained);

        const alwaysEnabledModals = (
            <React.Fragment>
                <TWSecurityManager securityManager={securityManager} />
                <TWRestorePointManager />
                {usernameModalVisible && <TWUsernameModal />}
                {settingsModalVisible && <TWSettingsModal />}
                {customExtensionModalVisible && <TWCustomExtensionModal />}
                {fontsModalVisible && <TWFontsModal />}
                {unknownPlatformModalVisible && <TWUnknownPlatformModal />}
                {invalidProjectModalVisible && <TWInvalidProjectModal />}
            </React.Fragment>
        );

        return isPlayerOnly ? (
            <React.Fragment>
                {/* TW: When the window is fullscreen, use an element to display the background color */}
                {/* The default color for transparency is inconsistent between browsers and there isn't an existing */}
                {/* element for us to style that fills the entire screen. */}
                {isWindowFullScreen ? (
                    <div
                        className={styles.fullscreenBackground}
                        style={{
                            backgroundColor: fullscreenBackgroundColor
                        }}
                    />
                ) : null}
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isEmbedded={isEmbedded}
                    isRendererSupported={isRendererSupported()}
                    isRtl={isRtl}
                    loading={loading}
                    stageSize={STAGE_SIZE_MODES.full}
                    vm={vm}
                >
                    {alertsVisible ? (
                        <Alerts className={styles.alertsContainer} />
                    ) : null}
                </StageWrapper>
                {alwaysEnabledModals}
            </React.Fragment>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                    minWidth: 1024 + Math.max(0, customStageSize.width - 480),
                    minHeight: 640 + Math.max(0, customStageSize.height - 360)
                }}
                {...componentProps}
            >
                {alwaysEnabledModals}
                {telemetryModalVisible ? (
                    <TelemetryModal
                        isRtl={isRtl}
                        isTelemetryEnabled={isTelemetryEnabled}
                        onCancel={onTelemetryModalCancel}
                        onOptIn={onTelemetryModalOptIn}
                        onOptOut={onTelemetryModalOptOut}
                        onRequestClose={onRequestCloseTelemetryModal}
                        onShowPrivacyPolicy={onShowPrivacyPolicy}
                    />
                ) : null}
                {loading ? (
                    <Loader isFullScreen />
                ) : null}
                {isCreating ? (
                    <Loader
                        isFullScreen
                        messageId="gui.loader.creating"
                    />
                ) : null}
                {isBrowserSupported() ? null : (
                    <BrowserModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                <MenuBar
                    accountNavOpen={accountNavOpen}
                    authorId={authorId}
                    authorThumbnailUrl={authorThumbnailUrl}
                    authorUsername={authorUsername}
                    canChangeLanguage={canChangeLanguage}
                    canChangeTheme={canChangeTheme}
                    canCreateCopy={canCreateCopy}
                    canCreateNew={canCreateNew}
                    canEditTitle={canEditTitle}
                    canManageFiles={canManageFiles}
                    canRemix={canRemix}
                    canSave={canSave}
                    canShare={canShare}
                    className={styles.menuBarPosition}
                    enableCommunity={enableCommunity}
                    isShared={isShared}
                    isTotallyNormal={isTotallyNormal}
                    logo={logo}
                    renderLogin={renderLogin}
                    showComingSoon={showComingSoon}
                    showOpenFilePicker={showOpenFilePicker}
                    showSaveFilePicker={showSaveFilePicker}
                    onClickAbout={onClickAbout}
                    onClickAccountNav={onClickAccountNav}
                    onClickAddonSettings={onClickAddonSettings}
                    onClickDesktopSettings={onClickDesktopSettings}
                    onClickNewWindow={onClickNewWindow}
                    onClickPackager={onClickPackager}
                    onClickLogo={onClickLogo}
                    onCloseAccountNav={onCloseAccountNav}
                    onLogOut={onLogOut}
                    onOpenRegistration={onOpenRegistration}
                    onProjectTelemetryEvent={onProjectTelemetryEvent}
                    onSeeCommunity={onSeeCommunity}
                    onShare={onShare}
                    onStartSelectingFileUpload={onStartSelectingFileUpload}
                    onToggleLoginOpen={onToggleLoginOpen}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList}>
                                    <Tab className={tabClassNames.tab}>
                                        <img
                                            draggable={false}
                                            src={codeIcon()}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Code"
                                            description="Button to get to the code panel"
                                            id="gui.gui.codeTab"
                                        />
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateCostumesTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={costumesIcon()}
                                        />
                                        {targetIsStage ? (
                                            <FormattedMessage
                                                defaultMessage="Backdrops"
                                                description="Button to get to the backdrops panel"
                                                id="gui.gui.backdropsTab"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Costumes"
                                                description="Button to get to the costumes panel"
                                                id="gui.gui.costumesTab"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateSoundsTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={soundsIcon()}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Sounds"
                                            description="Button to get to the sounds panel"
                                            id="gui.gui.soundsTab"
                                        />
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateSongsTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={songsIcon()}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Songs"
                                            description="Button to get to the songs panel"
                                            id="gui.gui.songsTab"
                                        />
                                    </Tab>
                                </TabList>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {isNano ? blocksTabVisible && <CMView theme={theme} vm={vm} /> : <><Box className={styles.blocksWrapper}>
                                            <Blocks
                                                key={`${blocksId}/${theme.id}`}
                                                canUseCloud={canUseCloud}
                                                grow={1}
                                                isVisible={blocksTabVisible}
                                                options={{
                                                    media: `${basePath}static/${theme.getBlocksMediaFolder()}/`
                                                }}
                                                stageSize={stageSize}
                                                onOpenCustomExtensionModal={onOpenCustomExtensionModal}
                                                theme={theme}
                                                vm={vm} />
                                                <Box className={styles.extensionButtonContainer}>
                                                <button
                                                    className={styles.extensionButton}
                                                    title={intl.formatMessage(messages.addExtension)}
                                                    onClick={isNano ? () => { alert('Adding extensions in NanoScript is not available yet') } : onExtensionButtonClick}
                                                >
                                                    <img
                                                        className={styles.extensionButtonIcon}
                                                        draggable={false}
                                                        src={addExtensionIcon} />{isNano && intl.formatMessage(messages.addExtension)}
                                                </button>
                                            </Box>
                                        </Box></>}
                                    <div className={classNames(styles.nanoscriptContainer, !isNano && styles.notNano)}>
                                        {!isNano && <ToggleButtons
                                            className={styles.buttonRow}
                                            buttons={[
                                                {
                                                    handleClick: () => {window.blocklyWorkspace.zoomCenter(1)},
                                                    isSelected: false,
                                                    children: '+'
                                                },
                                                {
                                                    handleClick: () => {window.blocklyWorkspace.zoomCenter(-1)},
                                                    isSelected: false,
                                                    children: '-'
                                                },
                                                {
                                                    handleClick: () => {window.blocklyWorkspace.setScale(0.675)},
                                                    isSelected: false,
                                                    children: '='
                                                }
                                            ]}
                                        />}
                                        <ToggleButtons
                                            className={styles.buttonRow}
                                            buttons={[
                                                {
                                                    handleClick: () => setNano(false),
                                                    icon: codeIcon,
                                                    isSelected: !isNano,
                                                    title: 'Block-based'
                                                },
                                                {
                                                    handleClick: () => setNano(true),
                                                    icon: nanoscriptIcon,
                                                    isSelected: isNano,
                                                    title: 'Text-based'
                                                }
                                            ]}
                                        />
                                    </div>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab
                                        vm={vm}
                                    /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {songsTabVisible ? <SongsTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null}
                        </Box>

                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isFullScreen={isFullScreen}
                                isRendererSupported={isRendererSupported()}
                                isRtl={isRtl}
                                stageSize={stageSize}
                                vm={vm}
                            />
                            <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    blocksId: PropTypes.string,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isEmbedded: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isWindowFullScreen: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickAddonSettings: PropTypes.func,
    onClickDesktopSettings: PropTypes.func,
    onClickNewWindow: PropTypes.func,
    onClickPackager: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    securityManager: PropTypes.shape({}),
    showComingSoon: PropTypes.bool,
    showOpenFilePicker: PropTypes.func,
    showSaveFilePicker: PropTypes.func,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    theme: PropTypes.instanceOf(Theme),
    tipsLibraryVisible: PropTypes.bool,
    usernameModalVisible: PropTypes.bool,
    settingsModalVisible: PropTypes.bool,
    customExtensionModalVisible: PropTypes.bool,
    fontsModalVisible: PropTypes.bool,
    unknownPlatformModalVisible: PropTypes.bool,
    invalidProjectModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    blocksId: 'original',
    canChangeLanguage: true,
    canChangeTheme: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    isTotallyNormal: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize,
    isWindowFullScreen: state.scratchGui.tw.isWindowFullScreen,
    // This is the button's mode, as opposed to the actual current state
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
