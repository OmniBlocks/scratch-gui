import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import styles from './markdown-editor.css';

const messages = defineMessages({
    heading1: {
        id: 'gui.markdownEditor.heading1',
        defaultMessage: 'Heading 1',
        description: 'Tooltip for heading 1 button'
    },
    heading2: {
        id: 'gui.markdownEditor.heading2',
        defaultMessage: 'Heading 2',
        description: 'Tooltip for heading 2 button'
    },
    heading3: {
        id: 'gui.markdownEditor.heading3',
        defaultMessage: 'Heading 3',
        description: 'Tooltip for heading 3 button'
    },
    bold: {
        id: 'gui.markdownEditor.bold',
        defaultMessage: 'Bold',
        description: 'Tooltip for bold button'
    },
    italic: {
        id: 'gui.markdownEditor.italic',
        defaultMessage: 'Italic',
        description: 'Tooltip for italic button'
    },
    bulletList: {
        id: 'gui.markdownEditor.bulletList',
        defaultMessage: 'Bullet List',
        description: 'Tooltip for bullet list button'
    },
    numberedList: {
        id: 'gui.markdownEditor.numberedList',
        defaultMessage: 'Numbered List',
        description: 'Tooltip for numbered list button'
    },
    link: {
        id: 'gui.markdownEditor.link',
        defaultMessage: 'Link',
        description: 'Tooltip for link button'
    },
    placeholder: {
        id: 'gui.markdownEditor.placeholder',
        defaultMessage: 'Write your project notes and credits here...',
        description: 'Placeholder text for markdown editor'
    }
});

class MarkdownEditor extends React.Component {
    constructor (props) {
        super(props);
        this.textareaRef = React.createRef();
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertMarkdown = this.insertMarkdown.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleTextChange (e) {
        this.props.onChange(e.target.value);
    }

    handleKeyDown (e) {
        // Handle tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = this.textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            
            // Insert tab character
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            this.props.onChange(newValue);
            
            // Set cursor position after the inserted tab
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
        }
    }

    insertMarkdown (before, after = '', placeholder = '') {
        const textarea = this.textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const replacement = before + (selectedText || placeholder) + after;
        
        const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        this.props.onChange(newValue);
        
        // Set cursor position
        setTimeout(() => {
            if (selectedText) {
                textarea.selectionStart = start + before.length;
                textarea.selectionEnd = start + before.length + selectedText.length;
            } else {
                textarea.selectionStart = textarea.selectionEnd = start + before.length + placeholder.length;
            }
            textarea.focus();
        }, 0);
    }

    render () {
        const {
            className,
            value,
            intl,
            ...props
        } = this.props;

        return (
            <div className={classNames(styles.markdownEditor, className)}>
                <div className={styles.toolbar}>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.heading1)}
                        onClick={() => this.insertMarkdown('# ', '', 'Heading 1')}
                    >
                        H1
                    </button>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.heading2)}
                        onClick={() => this.insertMarkdown('## ', '', 'Heading 2')}
                    >
                        H2
                    </button>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.heading3)}
                        onClick={() => this.insertMarkdown('### ', '', 'Heading 3')}
                    >
                        H3
                    </button>
                    <div className={styles.separator} />
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.bold)}
                        onClick={() => this.insertMarkdown('**', '**', 'bold text')}
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.italic)}
                        onClick={() => this.insertMarkdown('*', '*', 'italic text')}
                    >
                        <em>I</em>
                    </button>
                    <div className={styles.separator} />
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.bulletList)}
                        onClick={() => this.insertMarkdown('- ', '', 'list item')}
                    >
                        •
                    </button>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.numberedList)}
                        onClick={() => this.insertMarkdown('1. ', '', 'list item')}
                    >
                        1.
                    </button>
                    <button
                        className={styles.toolbarButton}
                        title={intl.formatMessage(messages.link)}
                        onClick={() => this.insertMarkdown('[', '](https://example.com)', 'link text')}
                    >
                        🔗
                    </button>
                </div>
                <textarea
                    ref={this.textareaRef}
                    className={styles.textarea}
                    value={value}
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder={intl.formatMessage(messages.placeholder)}
                    {...props}
                />
            </div>
        );
    }
}

MarkdownEditor.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    intl: intlShape.isRequired
};

MarkdownEditor.defaultProps = {
    value: ''
};

export default injectIntl(MarkdownEditor);