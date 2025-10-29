import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './markdown-preview.css';

// Simple markdown parser for basic formatting
const parseMarkdown = (text) => {
    if (!text) return '';
    
    let html = text;
    
    // Escape HTML to prevent XSS
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    
    // Headers (must be at start of line)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    const lines = html.split('\n');
    let inUnorderedList = false;
    let inOrderedList = false;
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Unordered list
        if (trimmedLine.match(/^[-*+] /)) {
            if (!inUnorderedList) {
                processedLines.push('<ul>');
                inUnorderedList = true;
            }
            if (inOrderedList) {
                processedLines.push('</ol>');
                inOrderedList = false;
            }
            processedLines.push(`<li>${trimmedLine.substring(2)}</li>`);
        }
        // Ordered list
        else if (trimmedLine.match(/^\d+\. /)) {
            if (!inOrderedList) {
                processedLines.push('<ol>');
                inOrderedList = true;
            }
            if (inUnorderedList) {
                processedLines.push('</ul>');
                inUnorderedList = false;
            }
            const match = trimmedLine.match(/^\d+\. (.*)$/);
            processedLines.push(`<li>${match[1]}</li>`);
        }
        // Regular line
        else {
            if (inUnorderedList) {
                processedLines.push('</ul>');
                inUnorderedList = false;
            }
            if (inOrderedList) {
                processedLines.push('</ol>');
                inOrderedList = false;
            }
            
            if (trimmedLine === '') {
                processedLines.push('<br>');
            } else {
                processedLines.push(line);
            }
        }
    }
    
    // Close any open lists
    if (inUnorderedList) {
        processedLines.push('</ul>');
    }
    if (inOrderedList) {
        processedLines.push('</ol>');
    }
    
    return processedLines.join('\n');
};

const MarkdownPreview = ({className, content}) => (
    <div className={classNames(styles.markdownPreview, className)}>
        <div 
            className={styles.content}
            dangerouslySetInnerHTML={{__html: parseMarkdown(content)}}
        />
    </div>
);

MarkdownPreview.propTypes = {
    className: PropTypes.string,
    content: PropTypes.string
};

MarkdownPreview.defaultProps = {
    content: ''
};

export default MarkdownPreview;