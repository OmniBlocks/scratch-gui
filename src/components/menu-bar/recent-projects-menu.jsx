import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import {MenuItem, Submenu} from '../menu/menu.jsx';
import fileIcon from './icon--file.svg';
import {recentProjectsMenuOpen, openRecentProjectsMenu} from '../../reducers/menus.js';
import {getRecentProjects, clearAllRecentProjects, checkFilePermission} from '../../lib/tw-recent-projects-api';
import {loadRecentProjects} from '../../reducers/recent-projects';
import sharedMessages from '../../lib/shared-messages';

import styles from './settings-menu.css';
import dropdownCaret from './dropdown-caret.svg';

class RecentProjectsMenu extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOpenProject',
            'handleClearRecent'
        ]);
    }

    async handleOpenProject (project) {
        try {
            // Check permission
            const hasPermission = await checkFilePermission(project.handle);
            if (!hasPermission) {
                this.props.onShowAlert('openRecentProjectError');
                return;
            }

            // Get file and load it
            const file = await project.handle.getFile();
            this.props.onLoadingStarted();
            
            const reader = new FileReader();
            reader.onload = () => {
                this.props.vm.loadProject(reader.result)
                    .then(() => {
                        this.props.onSetFileHandle(project.handle);
                        this.props.onLoadingFinished();
                        this.props.onRequestCloseFile();
                    })
                    .catch(error => {
                        console.error('Error loading project:', error);
                        this.props.onLoadingFinished();
                        this.props.onShowAlert('openRecentProjectError');
                    });
            };
            reader.onerror = () => {
                this.props.onLoadingFinished();
                this.props.onShowAlert('openRecentProjectError');
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error opening recent project:', error);
            this.props.onLoadingFinished();
            this.props.onShowAlert('openRecentProjectError');
        }
    }

    handleClearRecent () {
        clearAllRecentProjects()
            .then(success => {
                if (success) {
                    this.props.onClearRecentProjects();
                }
            })
            .catch(error => {
                console.error('Error clearing recent projects:', error);
            });
    }

    render () {
        const hasProjects = this.props.recentProjects && this.props.recentProjects.length > 0;
        
        return (
            <MenuItem
                expanded={this.props.menuOpen}
            >
                <div
                    className={styles.option}
                    onClick={this.props.onRequestOpen}
                >
                    <img
                        className={styles.icon}
                        src={fileIcon}
                        draggable={false}
                        width={20}
                        height={20}
                    />
                    <span className={styles.submenuLabel}>
                        <FormattedMessage {...sharedMessages.recentProjects} />
                    </span>
                    <img
                        className={styles.expandCaret}
                        src={dropdownCaret}
                        draggable={false}
                    />
                </div>
                <Submenu
                    className={styles.recentProjectsSubmenu}
                    place={this.props.isRtl ? 'left' : 'right'}
                >
                    {hasProjects ? (
                        this.props.recentProjects.map((project, index) => (
                            <MenuItem
                                key={`recent-${project.timestamp}-${index}`}
                                className={styles.recentProjectMenuItem}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={() => this.handleOpenProject(project)}
                            >
                                {project.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>
                            <FormattedMessage {...sharedMessages.noRecentProjects} />
                        </MenuItem>
                    )}
                    <MenuItem
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={this.handleClearRecent}
                    >
                        <FormattedMessage {...sharedMessages.clearRecentProjects} />
                    </MenuItem>
                </Submenu>
            </MenuItem>
        );
    }
}

RecentProjectsMenu.propTypes = {
    isRtl: PropTypes.bool,
    menuOpen: PropTypes.bool,
    onClearRecentProjects: PropTypes.func,
    onLoadingFinished: PropTypes.func,
    onLoadingStarted: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestOpen: PropTypes.func,
    onSetFileHandle: PropTypes.func,
    onShowAlert: PropTypes.func,
    recentProjects: PropTypes.arrayOf(PropTypes.shape({
        handle: PropTypes.object,
        name: PropTypes.string,
        timestamp: PropTypes.number
    })),
    vm: PropTypes.object
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    menuOpen: recentProjectsMenuOpen(state),
    recentProjects: state.scratchGui.recentProjects.projects || [],
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onClearRecentProjects: () => dispatch(loadRecentProjects([])),
    onRequestOpen: () => dispatch(openRecentProjectsMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecentProjectsMenu);
