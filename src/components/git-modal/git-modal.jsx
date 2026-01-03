import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import Input from '../forms/input.jsx';
import styles from './git-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Git Integration',
        description: 'Title of Git modal',
        id: 'tw.gitModal.title'
    }
});

class GitModalComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUrlChange',
            'handleCommitMessageChange',
            'handleTokenChange',
            'handleClone',
            'handlePush',
            'handlePull',
            'handleCommit'
        ]);
        this.state = {
            url: '',
            commitMessage: 'Update project',
            token: ''
        };
    }

    handleUrlChange (e) {
        this.setState({url: e.target.value});
    }

    handleCommitMessageChange (e) {
        this.setState({commitMessage: e.target.value});
    }

    handleTokenChange (e) {
        this.setState({token: e.target.value});
    }

    handleClone () {
        this.props.onClone(this.state.url);
    }

    handlePush () {
        this.props.onPush(this.state.url, this.state.token);
    }

    handlePull () {
        this.props.onPull(this.state.url);
    }

    handleCommit () {
        this.props.onCommit(this.state.commitMessage);
    }

    render () {
        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(messages.title)}
                id="gitModal"
                onRequestClose={this.props.onClose}
            >
                <Box className={styles.body}>
                    <div className={styles.section}>
                        <h3>
                            <FormattedMessage
                                defaultMessage="Repository"
                                id="tw.gitModal.repository"
                            />
                        </h3>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.button}
                                onClick={this.props.onSelectLocalFolder}
                            >
                                <FormattedMessage
                                    defaultMessage="Link to Local Folder"
                                    id="tw.gitModal.selectLocalFolder"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={this.props.onUseDefaultStorage}
                            >
                                <FormattedMessage
                                    defaultMessage="Use Browser Storage"
                                    id="tw.gitModal.useDefaultStorage"
                                />
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>
                                <FormattedMessage
                                    defaultMessage="Git URL"
                                    id="tw.gitModal.url"
                                />
                            </label>
                            <Input
                                placeholder="https://github.com/user/repo.git"
                                value={this.state.url}
                                onChange={this.handleUrlChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>
                                <FormattedMessage
                                    defaultMessage="Personal Access Token"
                                    id="tw.gitModal.token"
                                />
                            </label>
                            <Input
                                placeholder="ghp_..."
                                type="password"
                                value={this.state.token}
                                onChange={this.handleTokenChange}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.button}
                                onClick={this.handleClone}
                            >
                                <FormattedMessage
                                    defaultMessage="Clone"
                                    id="tw.gitModal.clone"
                                />
                            </button>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.section}>
                        <h3>
                            <FormattedMessage
                                defaultMessage="Sync"
                                id="tw.gitModal.sync"
                            />
                        </h3>
                        <div className={styles.inputGroup}>
                            <label>
                                <FormattedMessage
                                    defaultMessage="Commit Message"
                                    id="tw.gitModal.commitMessage"
                                />
                            </label>
                            <Input
                                value={this.state.commitMessage}
                                onChange={this.handleCommitMessageChange}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.button}
                                onClick={this.props.onExportToGit}
                            >
                                <FormattedMessage
                                    defaultMessage="Save to Git"
                                    id="tw.gitModal.saveToGit"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={this.handleCommit}
                            >
                                <FormattedMessage
                                    defaultMessage="Commit"
                                    id="tw.gitModal.commit"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={this.handlePush}
                            >
                                <FormattedMessage
                                    defaultMessage="Push"
                                    id="tw.gitModal.push"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={this.handlePull}
                            >
                                <FormattedMessage
                                    defaultMessage="Pull"
                                    id="tw.gitModal.pull"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={this.props.onImportFromGit}
                            >
                                <FormattedMessage
                                    defaultMessage="Load from Git"
                                    id="tw.gitModal.loadFromGit"
                                />
                            </button>
                        </div>
                    </div>
                    
                    {this.props.loading && (
                        <div className={styles.loadingOverlay}>
                            <FormattedMessage
                                defaultMessage="Processing..."
                                id="tw.gitModal.loading"
                            />
                        </div>
                    )}
                </Box>
            </Modal>
        );
    }
}

GitModalComponent.propTypes = {
    intl: intlShape,
    loading: PropTypes.bool,
    onClone: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onCommit: PropTypes.func.isRequired,
    onExportToGit: PropTypes.func.isRequired,
    onImportFromGit: PropTypes.func.isRequired,
    onPull: PropTypes.func.isRequired,
    onPush: PropTypes.func.isRequired,
    onSelectLocalFolder: PropTypes.func.isRequired,
    onUseDefaultStorage: PropTypes.func.isRequired
};

export default injectIntl(GitModalComponent);
