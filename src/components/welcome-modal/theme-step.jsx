import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import {setTheme} from '../../reducers/theme';
import {persistTheme} from '../../lib/themes/themePersistance';
import {
    Theme,
    ACCENT_AQUA,
    ACCENT_PURPLE,
    ACCENT_BLUE,
    ACCENT_RED,
    ACCENT_RAINBOW,
    GUI_LIGHT,
    GUI_DARK
} from '../../lib/themes';
import styles from './theme-step.css';

class ThemeStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGuiChange',
            'handleAccentChange'
        ]);

        // Available accent colors with display info
        this.accentColors = [
            {id: ACCENT_AQUA, name: 'Aqua', color: '#59C0C0'},
            {id: ACCENT_PURPLE, name: 'Purple', color: '#9966FF'},
            {id: ACCENT_BLUE, name: 'Blue', color: '#4C97FF'},
            {id: ACCENT_RED, name: 'Red', color: '#FF6680'},
            {id: ACCENT_RAINBOW, name: 'Rainbow', color: 'linear-gradient(90deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9)'}
        ];
    }

    handleGuiChange (newGui) {
        const newTheme = this.props.theme.set('gui', newGui);
        this.props.onSetTheme(newTheme);
        persistTheme(newTheme);
    }

    handleAccentChange (newAccent) {
        const newTheme = this.props.theme.set('accent', newAccent);
        this.props.onSetTheme(newTheme);
        persistTheme(newTheme);
    }

    render () {
        const currentGui = this.props.theme.gui;
        const currentAccent = this.props.theme.accent;

        return (
            <div className={styles.themeStep}>
                <div className={styles.illustrationContainer}>
                    {/* Your SVG illustration goes here! */}
                    <div className={styles.illustrationPlaceholder}>
                        🎨 Your theme SVG illustration here!
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>Choose Your Theme 🎨</h2>
                    <p className={styles.subtitle}>
                        Pick a look that matches your style
                    </p>

                    {/* Light/Dark Toggle */}
                    <div className={styles.themeSelector}>
                        <button
                            className={
                                currentGui === GUI_LIGHT ?
                                    `${styles.themeOption} ${styles.selected}` :
                                    styles.themeOption
                            }
                            onClick={() => this.handleGuiChange(GUI_LIGHT)}
                        >
                            <div className={styles.themePreview}>
                                ☀️
                            </div>
                            <span>Light Mode</span>
                        </button>

                        <button
                            className={
                                currentGui === GUI_DARK ?
                                    `${styles.themeOption} ${styles.selected}` :
                                    styles.themeOption
                            }
                            onClick={() => this.handleGuiChange(GUI_DARK)}
                        >
                            <div className={styles.themePreview}>
                                🌙
                            </div>
                            <span>Dark Mode</span>
                        </button>
                    </div>

                    {/* Accent Color Picker */}
                    <div className={styles.accentSection}>
                        <h3 className={styles.accentTitle}>Accent Color</h3>
                        <div className={styles.colorGrid}>
                            {this.accentColors.map(({id, name, color}) => (
                                <button
                                    key={id}
                                    className={
                                        currentAccent === id ?
                                            `${styles.colorOption} ${styles.selectedColor}` :
                                            styles.colorOption
                                    }
                                    style={{
                                        background: color
                                    }}
                                    onClick={() => this.handleAccentChange(id)}
                                    title={name}
                                >
                                    {currentAccent === id && (
                                        <span className={styles.checkmark}>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ThemeStep.propTypes = {
    theme: PropTypes.instanceOf(Theme).isRequired,
    onSetTheme: PropTypes.func.isRequired,
    onNext: PropTypes.func,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool
};

const mapStateToProps = state => ({
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onSetTheme: theme => dispatch(setTheme(theme))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ThemeStep);