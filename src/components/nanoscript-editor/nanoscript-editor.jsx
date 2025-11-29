import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import styles from './nanoscript-editor.css';

class NanoScriptEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleTextChange',
            'convertBlocksToText',
            'convertTextToBlocks'
        ]);
        
        this.state = {
            nanoScriptText: this.convertBlocksToText()
        };
    }

    componentDidMount() {
        // Update text when switching to this tab
        this.setState({
            nanoScriptText: this.convertBlocksToText()
        });
    }

    handleTextChange(event) {
        this.setState({
            nanoScriptText: event.target.value
        });
        // TODO: Implement real-time conversion back to blocks
    }

    convertBlocksToText() {
        // TODO: Implement actual block-to-text conversion
        // For now, return a sample NanoScript
        return `// NanoScript Mode - Text representation of your blocks
// This is a preview implementation

when green flag clicked
  say "Hello, World!" for 2 seconds
  move 10 steps
  repeat 10 times
    turn right 15 degrees
  end

when space key pressed
  play sound "meow"
  change x by 10

// More blocks will appear here as you create them in the Blocks tab
// Edit this text to modify your program!`;
    }

    convertTextToBlocks(text) {
        // TODO: Implement actual text-to-blocks conversion
        console.log('Converting text to blocks:', text);
    }

    render() {
        return (
            <Box className={styles.editorContainer}>
                <div className={styles.header}>
                    <h3>NanoScript Editor</h3>
                    <p>Edit your blocks as text! Changes will sync with the Blocks tab.</p>
                </div>
                <textarea
                    className={styles.textEditor}
                    value={this.state.nanoScriptText}
                    onChange={this.handleTextChange}
                    placeholder="Your NanoScript code will appear here..."
                    spellCheck={false}
                />
                <div className={styles.footer}>
                    <small>
                        NanoScript is a text-based representation of Scratch blocks. 
                        Use simple, readable syntax to create your programs.
                    </small>
                </div>
            </Box>
        );
    }
}

NanoScriptEditor.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

export default NanoScriptEditor;