import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import GitModalComponent from '../components/git-modal/git-modal.jsx';
import {closeGitModal} from '../reducers/modals';
import {setGitLoading} from '../reducers/git';
import gitManager from '../lib/git-manager';
import {exportProjectToGit, importProjectFromGit} from '../lib/git-project-utils';
import {showAlertWithTimeout} from '../reducers/alerts';

class GitModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClone',
            'handleCommit',
            'handlePush',
            'handlePull',
            'handleExportToGit',
            'handleImportFromGit',
            'handleSelectLocalFolder',
            'handleUseDefaultStorage'
        ]);
    }

    async handleSelectLocalFolder () {
        if (!window.showDirectoryPicker) {
            this.props.onShowAlert('Your browser does not support the File System Access API');
            return;
        }
        try {
            const handle = await window.showDirectoryPicker();
            await gitManager.setDirectoryHandle(handle);
            this.props.onShowAlert(`Linked to ${handle.name}`);
        } catch (e) {
            if (e.name !== 'AbortError') {
                console.error(e);
                this.props.onShowAlert('Failed to select folder');
            }
        }
    }

    async handleUseDefaultStorage () {
        await gitManager.useDefaultFs();
        this.props.onShowAlert('Switched to browser storage');
    }

    async handleClone (url) {
        this.props.onSetLoading(true);
        try {
            await gitManager.clone(url);
            this.props.onShowAlert('Git Clone Success');
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Git Clone Failed');
        }
        this.props.onSetLoading(false);
    }

    async handleCommit (message) {
        this.props.onSetLoading(true);
        try {
            const sha = await gitManager.commit(message);
            this.props.onShowAlert(`Git Commit Success: ${sha.substring(0, 7)}`);
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Git Commit Failed');
        }
        this.props.onSetLoading(false);
    }

    async handlePush (url, token) {
        this.props.onSetLoading(true);
        try {
            await gitManager.push(url, token);
            this.props.onShowAlert('Git Push Success');
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Git Push Failed');
        }
        this.props.onSetLoading(false);
    }

    async handlePull (url) {
        this.props.onSetLoading(true);
        try {
            await gitManager.pull(url);
            this.props.onShowAlert('Git Pull Success');
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Git Pull Failed');
        }
        this.props.onSetLoading(false);
    }

    async handleExportToGit () {
        this.props.onSetLoading(true);
        try {
            const content = await this.props.vm.saveProjectSb3();
            await exportProjectToGit(content);
            this.props.onShowAlert('Project exported to Git working directory');
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Export Failed');
        }
        this.props.onSetLoading(false);
    }

    async handleImportFromGit () {
        this.props.onSetLoading(true);
        try {
            const content = await importProjectFromGit();
            await this.props.vm.loadProject(content);
            this.props.onShowAlert('Project imported from Git working directory');
            this.props.onClose();
        } catch (e) {
            console.error(e);
            this.props.onShowAlert('Import Failed');
        }
        this.props.onSetLoading(false);
    }

    render () {
        return (
            <GitModalComponent
                loading={this.props.loading}
                onClone={this.handleClone}
                onClose={this.props.onClose}
                onCommit={this.handleCommit}
                onExportToGit={this.handleExportToGit}
                onImportFromGit={this.handleImportFromGit}
                onPull={this.handlePull}
                onPush={this.handlePush}
                onSelectLocalFolder={this.handleSelectLocalFolder}
                onUseDefaultStorage={this.handleUseDefaultStorage}
            />
        );
    }
}

GitModal.propTypes = {
    loading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSetLoading: PropTypes.func.isRequired,
    onShowAlert: PropTypes.func.isRequired,
    vm: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    loading: state.scratchGui.git.loading
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeGitModal()),
    onSetLoading: loading => dispatch(setGitLoading(loading)),
    onShowAlert: message => showAlertWithTimeout(dispatch, 'gitAlert', {message})
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GitModal);
