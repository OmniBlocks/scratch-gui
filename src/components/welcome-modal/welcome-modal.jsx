import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import WelcomeStep from './welcome-step.jsx';
import ThemeStep from './theme-step.jsx'; // Now connected to Redux!
import AddonsStep from './addons-step.jsx';
import FinalStep from './final-step.jsx';

import styles from './welcome-modal.css';



const WELCOME_COMPLETED_KEY = 'omniblocks:welcome_completed';

export const hasCompletedWelcome = () => {
    try {
        return localStorage.getItem(WELCOME_COMPLETED_KEY) === 'true';
    } catch (e) {
        return true;
    }
};

export const markWelcomeComplete = () => {
    try {
        localStorage.setItem(WELCOME_COMPLETED_KEY, 'true');
    } catch (e) {
        // ignore
    }
};

class WelcomeModal extends React.Component {
    constructor (props) {
        super(props);
        console.log('🎉 WelcomeModal constructor called!');
         if (typeof document !== 'undefined') {
            ReactModal.setAppElement('#app');
        }
        bindAll(this, [
            'handleNext',
            'handleBack',
            'handleFinish',
            'handleSkip'
        ]);
        
        this.state = {
            currentStep: 0
        };
        
        // Define all steps - easy to add more later!
        this.steps = [
            {
                id: 'welcome',
                component: WelcomeStep,
                skippable: false
            },
            {
                id: 'theme',
                component: ThemeStep,
                skippable: false
            },
            {
                id: 'addons',
                component: AddonsStep,
                skippable: true
            },
            {
                id: 'final',
                component: FinalStep,
                skippable: false
            }
            // Add analytics step here later:
            // {
            //     id: 'analytics',
            //     component: AnalyticsStep,
            //     skippable: false
            // }
        ];
    }

    handleNext () {
        if (this.state.currentStep < this.steps.length - 1) {
            this.setState({currentStep: this.state.currentStep + 1});
        } else {
            this.handleFinish();
        }
    }

    handleBack () {
        if (this.state.currentStep > 0) {
            this.setState({currentStep: this.state.currentStep - 1});
        }
    }

    handleSkip () {
        // Skip directly to next step
        this.handleNext();
    }

    handleFinish () {
        markWelcomeComplete();
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
    }

    render () {
        const currentStepConfig = this.steps[this.state.currentStep];
        const CurrentStepComponent = currentStepConfig.component;
        const isSkippable = currentStepConfig.skippable;
        const isFirstStep = this.state.currentStep === 0;
        const isLastStep = this.state.currentStep === this.steps.length - 1;

        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                contentLabel="Welcome to OmniBlocks"
                overlayClassName={styles.modalOverlay}
                onRequestClose={null} // Disable closing by clicking outside
                shouldCloseOnOverlayClick={false}
            >
                <div className={styles.container}>
                    {/* Step indicator dots */}
                    <div className={styles.stepIndicator}>
                        {this.steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={
                                    index === this.state.currentStep ?
                                        styles.stepDotActive :
                                        (index < this.state.currentStep ?
                                            styles.stepDotCompleted :
                                            styles.stepDot)
                                }
                            />
                        ))}
                    </div>

                    {/* Current step content */}
                    <div className={styles.stepContent}>
                        <CurrentStepComponent
                            onNext={this.handleNext}
                            onBack={this.handleBack}
                            onSkip={this.handleSkip}
                            onFinish={this.handleFinish}
                            isFirstStep={isFirstStep}
                            isLastStep={isLastStep}
                            {...this.props}
                        />
                    </div>

                    {/* Navigation buttons */}
                    <div className={styles.buttonRow}>
                        {!isFirstStep && (
                            <button
                                className={styles.backButton}
                                onClick={this.handleBack}
                            >
                                ← Back
                            </button>
                        )}
                        
                        <div className={styles.rightButtons}>
                            {isSkippable && (
                                <button
                                    className={styles.skipButton}
                                    onClick={this.handleSkip}
                                >
                                    Skip
                                </button>
                            )}

                            <button
                                className={styles.nextButton}
                                onClick={isLastStep ? this.handleFinish : this.handleNext}
                            >
                                {isLastStep ? "Let's Go! 🚀" : 'Next →'}
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>
        );
    }
}

WelcomeModal.propTypes = {
    onRequestClose: PropTypes.func
    // Removed onThemeChange and onAccentColorChange - handled by Redux now!
};

export default WelcomeModal;