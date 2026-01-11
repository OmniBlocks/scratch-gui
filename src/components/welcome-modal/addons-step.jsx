import React from 'react';
import PropTypes from 'prop-types';
import styles from './addons-step.css';

const AddonsStep = () => (
    <div className={styles.addonsStep}>
        <div className={styles.header}>
            <div className={styles.illustrationContainer}>
                {/* Your SVG illustration goes here! */}
                <div className={styles.illustrationPlaceholder}>
                    🧩 Your addons SVG illustration here!
                </div>
            </div>

            <div className={styles.headerText}>
                <h2 className={styles.title}>Set Up Your Addons 🧩</h2>
                <p className={styles.subtitle}>
                    Customize OmniBlocks with powerful extensions
                </p>
            </div>
        </div>

        <div className={styles.iframeContainer}>
            <iframe
                className={styles.addonsIframe}
                src="/addons"
                title="Addons Setup"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-storage-access-by-user-activation"
            />
        </div>

        <div className={styles.footer}>
            <p className={styles.footerNote}>
                💡 Don't worry, you can change these anytime in Settings!
            </p>
        </div>
    </div>
);

AddonsStep.propTypes = {
    onNext: PropTypes.func,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool
};

export default AddonsStep;