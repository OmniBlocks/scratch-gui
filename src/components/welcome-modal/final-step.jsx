import React from 'react';
import PropTypes from 'prop-types';
import styles from './final-step.css';

const FinalStep = () => (
    <div className={styles.finalStep}>
        <div className={styles.illustrationContainer}>
            {/* Your SVG illustration goes here! */}
            <div className={styles.illustrationPlaceholder}>
                🚀 Your final SVG illustration here!
            </div>
        </div>

        <div className={styles.content}>
            <h1 className={styles.title}>
                You're All Set! 🎉
            </h1>
            
            <p className={styles.subtitle}>
                Ready to start creating amazing projects?
            </p>

            <div className={styles.tipsSection}>
                <h3 className={styles.tipsTitle}>Quick Tips 💡</h3>
                <div className={styles.tips}>
                    <div className={styles.tip}>
                        <span className={styles.tipIcon}>⚙️</span>
                        <span>Access settings anytime from the menu bar</span>
                    </div>
                    <div className={styles.tip}>
                        <span className={styles.tipIcon}>📚</span>
                        <span>Check out tutorials to learn advanced features</span>
                    </div>
                    <div className={styles.tip}>
                        <span className={styles.tipIcon}>💾</span>
                        <span>Remember to save your projects regularly</span>
                    </div>
                </div>
            </div>

            <div className={styles.celebration}>
                <span className={styles.emoji}>🎊</span>
                <span className={styles.emoji}>✨</span>
                <span className={styles.emoji}>🎨</span>
                <span className={styles.emoji}>🚀</span>
            </div>
        </div>
    </div>
);

FinalStep.propTypes = {
    onFinish: PropTypes.func,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool
};

export default FinalStep;