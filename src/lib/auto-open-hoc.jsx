import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import {setFileHandle, addRecentFile, setAutoOpenEnabled} from '../reducers/tw';
import {loadRecentFiles, loadAutoOpenSetting} from '../lib/recent-files-manager';

/**
 * HOC to handle auto-opening of recent files on startup
 * @param {React.Component} WrappedComponent component to wrap
 * @returns {React.Component} wrapped component with auto-open functionality
 */
const AutoOpenHOC = function (WrappedComponent) {
    class AutoOpenComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'tryAutoOpen'
            ]);
            this.hasTriedAutoOpen = false;
        }

        componentDidMount () {
            // Load settings from localStorage on mount
            const autoOpenEnabled = loadAutoOpenSetting();
            const recentFiles = loadRecentFiles();
            
            this.props.onSetAutoOpenEnabled(autoOpenEnabled);
            this.props.onSetRecentFiles(recentFiles);

            // Try auto-open if enabled and we have recent files
            if (autoOpenEnabled && recentFiles.length > 0) {
                this.tryAutoOpen();
            }
        }

        async tryAutoOpen () {
            if (this.hasTriedAutoOpen) {
                return; // Prevent multiple attempts
            }
            this.hasTriedAutoOpen = true;

            // Check if File System Access API is supported
            if (!window.showOpenFilePicker) {
                console.log('Auto-open not supported: File System Access API not available');
                return;
            }

            const recentFiles = this.props.recentFiles;
            if (!recentFiles || recentFiles.length === 0) {
                return;
            }

            // Get the most recent file
            const mostRecent = recentFiles[0];
            
            try {
                // Note: We can't directly access the file without user permission.
                // The File System Access API requires user interaction to grant permission.
                // So we'll show a prompt to the user asking if they want to open the recent file.
                
                // For now, we'll just log it. In a production implementation, 
                // you'd want to show a UI element asking the user if they want to reopen the file.
                console.log('Most recent file:', mostRecent.name);
                
                // We can't automatically open without permission, but we could show a banner
                // or notification asking if they want to reopen their last file.
            } catch (err) {
                console.error('Auto-open failed:', err);
            }
        }

        render () {
            const {
                onSetAutoOpenEnabled,
                onSetRecentFiles,
                ...componentProps
            } = this.props;
            
            return (
                <WrappedComponent
                    {...componentProps}
                />
            );
        }
    }

    AutoOpenComponent.propTypes = {
        recentFiles: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            timestamp: PropTypes.number
        })),
        onSetAutoOpenEnabled: PropTypes.func.isRequired,
        onSetRecentFiles: PropTypes.func.isRequired
    };

    const mapStateToProps = state => ({
        recentFiles: state.scratchGui.tw.recentFiles,
        autoOpenEnabled: state.scratchGui.tw.autoOpenEnabled
    });

    const mapDispatchToProps = dispatch => ({
        onSetAutoOpenEnabled: enabled => dispatch(setAutoOpenEnabled(enabled)),
        onSetRecentFiles: files => dispatch(addRecentFile(files))
    });

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(AutoOpenComponent);
};

export default AutoOpenHOC;
