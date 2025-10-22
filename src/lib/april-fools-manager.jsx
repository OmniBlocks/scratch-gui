import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {APRIL_FOOLS_FEATURES} from '../reducers/april-fools';

/**
 * Higher-order component that adds April Fools functionality to the GUI
 */
class AprilFoolsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confettiActive: false,
            soundsLoaded: false,
            audioContext: null,
            sounds: {}
        };
        
        // Bind methods
        this.playSound = this.playSound.bind(this);
        this.triggerConfetti = this.triggerConfetti.bind(this);
        this.handleBlockConnect = this.handleBlockConnect.bind(this);
    }

    componentDidMount() {
        this.initializeSounds();
        this.setupEventListeners();
    }

    componentDidUpdate(prevProps) {
        // Handle feature changes
        if (prevProps.aprilFools.features !== this.props.aprilFools.features) {
            this.updateActiveFeatures();
        }
    }

    componentWillUnmount() {
        this.cleanupEventListeners();
    }

    initializeSounds() {
        if (!this.props.aprilFools.features[APRIL_FOOLS_FEATURES.SILLY_SOUNDS]) return;
        
        try {
            // Create audio context for sound effects
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Create simple sound effects using Web Audio API
            const sounds = {
                pop: this.createPopSound(audioContext),
                boop: this.createBoopSound(audioContext),
                meow: this.createMeowSound(audioContext),
                whoosh: this.createWhooshSound(audioContext)
            };
            
            this.setState({
                audioContext,
                sounds,
                soundsLoaded: true
            });
        } catch (error) {
            console.warn('Could not initialize April Fools sounds:', error);
        }
    }

    createPopSound(audioContext) {
        return () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }

    createBoopSound(audioContext) {
        return () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        };
    }

    createMeowSound(audioContext) {
        return () => {
            // Simple meow-like sound using multiple oscillators
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator1.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator1.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.2);
            
            oscillator2.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator2.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator2.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.2);
            oscillator2.stop(audioContext.currentTime + 0.2);
        };
    }

    createWhooshSound(audioContext) {
        return () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        };
    }

    playSound(soundName) {
        if (!this.state.soundsLoaded || !this.props.aprilFools.features[APRIL_FOOLS_FEATURES.SILLY_SOUNDS]) {
            return;
        }
        
        const sound = this.state.sounds[soundName];
        if (sound) {
            try {
                sound();
            } catch (error) {
                console.warn('Could not play sound:', error);
            }
        }
    }

    triggerConfetti() {
        if (!this.props.aprilFools.features[APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS]) return;
        
        this.setState({confettiActive: true});
        
        // Auto-disable confetti after animation
        setTimeout(() => {
            this.setState({confettiActive: false});
        }, 3000);
    }

    handleBlockConnect() {
        // Play sound when blocks are connected
        if (this.props.aprilFools.features[APRIL_FOOLS_FEATURES.SILLY_SOUNDS]) {
            const sounds = ['pop', 'boop'];
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            this.playSound(randomSound);
        }
        
        // Trigger confetti occasionally
        if (this.props.aprilFools.features[APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS] && Math.random() < 0.1) {
            this.triggerConfetti();
        }
    }

    setupEventListeners() {
        // Listen for block connection events
        if (this.props.vm) {
            this.props.vm.on('BLOCK_DRAG_END', this.handleBlockConnect);
        }
        
        // Listen for green flag clicks
        document.addEventListener('click', this.handleGreenFlagClick);
    }

    cleanupEventListeners() {
        if (this.props.vm) {
            this.props.vm.off('BLOCK_DRAG_END', this.handleBlockConnect);
        }
        
        document.removeEventListener('click', this.handleGreenFlagClick);
    }

    handleGreenFlagClick = event => {
        // Check if green flag was clicked
        if (event.target.closest('[class*="green-flag"]')) {
            if (this.props.aprilFools.features[APRIL_FOOLS_FEATURES.SILLY_SOUNDS]) {
                this.playSound('whoosh');
            }
            if (this.props.aprilFools.features[APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS]) {
                this.triggerConfetti();
            }
        }
    };

    updateActiveFeatures() {
        // Re-initialize sounds if needed
        if (this.props.aprilFools.features[APRIL_FOOLS_FEATURES.SILLY_SOUNDS] && !this.state.soundsLoaded) {
            this.initializeSounds();
        }
    }

    render() {
        const {aprilFools, children, ...otherProps} = this.props;
        const {confettiActive} = this.state;
        
        // Apply CSS classes based on active features
        const cssClasses = [];
        
        if (aprilFools.features[APRIL_FOOLS_FEATURES.RAINBOW_MODE]) {
            cssClasses.push('april-fools-rainbow');
        }
        
        if (aprilFools.features[APRIL_FOOLS_FEATURES.UPSIDE_DOWN_MODE]) {
            cssClasses.push('april-fools-upside-down');
        }
        
        if (aprilFools.features[APRIL_FOOLS_FEATURES.CAT_MODE]) {
            cssClasses.push('april-fools-cat-mode');
        }
        
        if (confettiActive) {
            cssClasses.push('april-fools-confetti');
        }

        return (
            <div className={cssClasses.join(' ')}>
                {children}
                {confettiActive && this.renderConfetti()}
            </div>
        );
    }

    renderConfetti() {
        const confettiPieces = [];
        for (let i = 0; i < 50; i++) {
            confettiPieces.push(
                <div
                    key={i}
                    className="confetti-piece"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
                    }}
                />
            );
        }
        
        return (
            <div className="confetti-container">
                {confettiPieces}
            </div>
        );
    }
}

AprilFoolsManager.propTypes = {
    aprilFools: PropTypes.shape({
        enabled: PropTypes.bool,
        features: PropTypes.object
    }),
    vm: PropTypes.object,
    children: PropTypes.node
};

const mapStateToProps = state => ({
    aprilFools: state.scratchGui.aprilFools,
    vm: state.scratchGui.vm
});

export default connect(mapStateToProps)(AprilFoolsManager);