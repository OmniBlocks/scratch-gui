import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import styles from './amp-hero-modal.css';

const AmpHeroModal = ({onRequestClose}) => (
    <Modal
        className={styles.modalContent}
        contentLabel="Thank you, Amp."
        onRequestClose={onRequestClose}
    >
        <Box className={styles.heroContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}></h2>
                <p className={styles.subtitle}>
                    Dedicated to Amp.
                </p>
                <p className={styles.date}>December 2, 2025 • The main branch was saved.</p>
            </div>
            <div className={styles.iframeWrapper}>
                <iframe
                    src="ampisahero.html"
                    className={styles.iframe}
                    title="Dedicated to Amp"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
            <div className={styles.footer}>
                <p><em>The guy who saved OmniBlocks</em></p>
            </div>
        </Box>
    </Modal>
);

AmpHeroModal.propTypes = {
    onRequestClose: PropTypes.func.isRequired
};

export default AmpHeroModal;
