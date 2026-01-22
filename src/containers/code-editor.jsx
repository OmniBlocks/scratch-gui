import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import Editor from '@monaco-editor/react';

import log from '../lib/log.js';
import Prompt from './prompt.jsx';
import ExtensionLibrary from './extension-library.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {Theme} from '../lib/themes';
import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox.js';
import {
    closeExtensionLibrary,
    openConnectionModal
} from '../reducers/modals.js';
 
class MonacoBlocks extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditorDidMount',
            'handleEditorChange',
            'handlePromptStart',
            'handlePromptCallback',
            'handlePromptClose'
        ]);

        this.state = {
            prompt: null
        };

        this.editor = null;
        this.monaco = null; 
    }

    handleEditorDidMount (editor, monaco) {
        this.editor = editor;
        this.monaco = monaco;


        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false
        });
        

        setTimeout(() => {
            editor.layout();
        }, 0);
    }

    handleEditorChange (value) {

        if (this.props.onCodeChange) {
            this.props.onCodeChange(value);
        }
        

        log.info('Code updated in general editor');
    }

    handlePromptStart (message, defaultValue, callback) {
        this.setState({
            prompt: {callback, message, defaultValue}
        });
    }

    handlePromptCallback (input) {
        this.state.prompt.callback(input);
        this.handlePromptClose();
    }

    handlePromptClose () {
        this.setState({prompt: null});
    }

    render () {
        const {
            isVisible,
            code,
            language,
            extensionLibraryVisible,
            onOpenConnectionModal,
            onRequestCloseExtensionLibrary
        } = this.props;

        if (!isVisible) return null;

        return (
            <React.Fragment>
                <div 
                    className="monaco-container"
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Editor
                        height="100%"
                        language={language || 'javascript'}
                        theme={this.props.theme.isDark() ? 'vs-dark' : 'vs'}
                        value={code}
                        onMount={this.handleEditorDidMount}
                        onChange={this.handleEditorChange}
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            tabSize: 4,
                            lineNumbers: 'on',
                            glyphMargin: true,
                            folding: true,
                            bracketPairColorization: { enabled: true }
                        }}
                    />
                </div>

                {extensionLibraryVisible && (
                    <ExtensionLibrary
                        onCategorySelected={(id) => onOpenConnectionModal(id)}
                        onRequestClose={onRequestCloseExtensionLibrary}
                    />
                )}

                {this.state.prompt && (
                    <Prompt
                        defaultValue={this.state.prompt.defaultValue}
                        label={this.state.prompt.message}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                )}
            </React.Fragment>
        );
    }
}

MonacoBlocks.propTypes = {
    code: PropTypes.string,
    extensionLibraryVisible: PropTypes.bool,
    isVisible: PropTypes.bool,
    language: PropTypes.string,
    onCodeChange: PropTypes.func,
    onOpenConnectionModal: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func
};

MonacoBlocks.defaultProps = {
    code: '',
    language: 'javascript'
};

const mapStateToProps = state => ({
    anyModalVisible: Object.keys(state.scratchGui.modals).some(key => state.scratchGui.modals[key]),
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,

    code: state.scratchGui.codeContent || '', 
    language: state.scratchGui.editorLanguage || 'javascript'
});

const mapDispatchToProps = dispatch => ({
    onOpenConnectionModal: id => {

        dispatch(openConnectionModal(id));
    },
    onRequestCloseExtensionLibrary: () => dispatch(closeExtensionLibrary()),

    onCodeChange: (value) => dispatch({type: 'UPDATE_CODE_CONTENT', content: value})
});

export default errorBoundaryHOC('GeneralCodeEditor')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(MonacoBlocks)
);