import React from 'react';
import PropTypes from 'prop-types';
import styles from './welcome-step.css';

const WelcomeStep = () => (
    <div className={styles.welcomeStep}>
        <div className={styles.illustrationContainer}>
            {/* Your SVG illustration goes here! */}
            <div className={styles.illustrationPlaceholder}>
                🎨 Your awesome SVG illustration here!
            </div>
        </div>

        <div className={styles.content}>
            <h1 className={styles.title}>
                Welcome to <span className={styles.highlight}>OmniBlocks</span>! 🎉
            </h1>
            
            <p className={styles.subtitle}>
                Let's set up your perfect creative environment in just a few quick steps!
            </p>

            <div className={styles.features}>
                <div className={styles.feature}>
                    <span className={styles.icon}>⚡</span>
                    <div className={styles.featureText}>
                        <h3>Lightning Fast</h3>
                        <p>Optimized for the best performance</p>
                    </div>
                </div>
                
                <div className={styles.feature}>
                    <span className={styles.icon}>🎨</span>
                    <div className={styles.featureText}>
                        <h3>Fully Customizable</h3>
                        <p>Make it your own with themes and addons</p>
                    </div>
                </div>
                
                <div className={styles.feature}>
                    <span className={styles.icon}>🚀</span>
                    <div className={styles.featureText}>
                        <h3>Powerful Features</h3>
                        <p>Everything you need to create amazing projects</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

WelcomeStep.propTypes = {
    onNext: PropTypes.func,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool
};

export default WelcomeStep;