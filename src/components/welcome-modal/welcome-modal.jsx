import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {APP_NAME} from '../../lib/brand.js';

import styles from './welcome-modal.css';

const messages = defineMessages({
    label: {
        id: 'tw.welcomeModal.label',
        defaultMessage: 'Welcome to {APP_NAME}',
        description: 'Title of the welcome modal'
    },
    title: {
        id: 'tw.welcomeModal.title',
        defaultMessage: 'Welcome to {APP_NAME}!',
        description: 'Welcome modal title'
    },
    description: {
        id: 'tw.welcomeModal.description',
        defaultMessage: 'Thanks for trying {APP_NAME}! This is a powerful Scratch mod with many features including free client-side Python execution, music creation tools, and much more. Get started by creating a new project or loading an existing one.',
        description: 'Welcome modal description'
    },
    getStarted: {
        id: 'tw.welcomeModal.getStarted',
        defaultMessage: 'Get Started',
        description: 'Button text to close welcome modal'
    }
});

const WelcomeModal = ({intl, isOpen, onClose, ...props}) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleClose();
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            className={styles.modalContent}
            contentLabel={intl.formatMessage(messages.label, {APP_NAME})}
            overlayClassName={styles.modalOverlay}
            onRequestClose={handleClose}
        >
            <div dir={props.isRtl ? 'rtl' : 'ltr'}>
                <Box className={styles.illustration}>
                    <span>🎉</span>
                </Box>

                <Box className={styles.body}>
                    <h2>
                        <FormattedMessage 
                            {...messages.title}
                            values={{APP_NAME}}
                        />
                    </h2>

                    <p>
                        <FormattedMessage 
                            {...messages.description}
                            values={{APP_NAME}}
                        />
                    </p>

                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        onKeyDown={handleKeyDown}
                        type="button"
                    >
                        <FormattedMessage {...messages.getStarted} />
                    </button>
                </Box>
            </div>
        </ReactModal>
    );
};

WelcomeModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
};

WelcomeModal.defaultProps = {
    isOpen: false,
    isRtl: false,
    onClose: null
};

const WrappedWelcomeModal = injectIntl(WelcomeModal);

WrappedWelcomeModal.setAppElement = ReactModal.setAppElement;

export default WrappedWelcomeModal;