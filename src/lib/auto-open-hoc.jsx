import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {addRecentFile, setAutoOpenEnabled} from '../reducers/tw';
import {loadRecentFiles, loadAutoOpenSetting} from '../lib/recent-files-manager';

/**
 * HOC to handle auto-opening of recent files on startup
 * @param {React.Component} WrappedComponent component to wrap
 * @returns {React.Component} wrapped component with auto-open functionality
 */
const AutoOpenHOC = function (WrappedComponent) {
    class AutoOpenComponent extends React.Component {
        componentDidMount () {
            // Load settings from localStorage on mount
            const autoOpenEnabled = loadAutoOpenSetting();
            const recentFiles = loadRecentFiles();
            
            this.props.onSetAutoOpenEnabled(autoOpenEnabled);
            this.props.onSetRecentFiles(recentFiles);
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
