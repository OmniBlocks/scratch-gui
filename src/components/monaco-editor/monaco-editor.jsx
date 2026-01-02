import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';
import Box from '../box/box.jsx';
import styles from './monaco-editor.css';

const MonacoEditor = ({
    language,
    theme,
    value,
    onChange,
    onMount,
    options,
    className,
    ...props
}) => {
    const [editorValue, setEditorValue] = useState(value || '// Welcome to OmniBlocks Code Editor!\n// Start coding here...\n\nconsole.log("Hello, OmniBlocks!");');
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        
        // Configure Monaco for better OmniBlocks integration
        monaco.editor.defineTheme('omniblocks-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955' },
                { token: 'keyword', foreground: '569CD6' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' }
            ],
            colors: {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4',
                'editorLineNumber.foreground': '#858585',
                'editor.selectionBackground': '#264f78',
                'editor.inactiveSelectionBackground': '#3a3d41'
            }
        });

        monaco.editor.defineTheme('omniblocks-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '008000' },
                { token: 'keyword', foreground: '0000ff' },
                { token: 'string', foreground: 'a31515' },
                { token: 'number', foreground: '098658' }
            ],
            colors: {
                'editor.background': '#ffffff',
                'editor.foreground': '#000000'
            }
        });

        if (onMount) {
            onMount(editor, monaco);
        }
    };

    const handleEditorChange = (newValue) => {
        setEditorValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const defaultOptions = {
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        ...options
    };

    return (
        <Box className={`${styles.monacoContainer} ${className || ''}`} {...props}>
            <Editor
                height="100%"
                language={language || 'javascript'}
                theme={theme === 'dark' ? 'omniblocks-dark' : 'omniblocks-light'}
                value={editorValue}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={defaultOptions}
            />
        </Box>
    );
};

MonacoEditor.propTypes = {
    language: PropTypes.string,
    theme: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onMount: PropTypes.func,
    options: PropTypes.object,
    className: PropTypes.string
};

MonacoEditor.defaultProps = {
    language: 'javascript',
    theme: 'light',
    value: '',
    onChange: null,
    onMount: null,
    options: {},
    className: ''
};

export default MonacoEditor;
