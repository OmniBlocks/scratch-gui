import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';

import {
    APRIL_FOOLS_FEATURES,
    PRANK_LEVELS,
    toggleAprilFools,
    setAprilFoolsFeature,
    setPrankLevel,
    resetAprilFools,
    setAutoActivate
} from '../../reducers/april-fools';

import Box from '../box/box.jsx';
import styles from './april-fools-settings.css';

const messages = defineMessages({
    aprilFoolsTitle: {
        id: 'gui.aprilFools.title',
        defaultMessage: 'April Fools Settings',
        description: 'Title for April Fools settings section'
    },
    aprilFoolsDescription: {
        id: 'gui.aprilFools.description',
        defaultMessage: 'Add some fun and silliness to your OmniBlocks experience!',
        description: 'Description for April Fools settings'
    },
    enableAprilFools: {
        id: 'gui.aprilFools.enable',
        defaultMessage: 'Enable April Fools Mode',
        description: 'Toggle to enable April Fools features'
    },
    prankLevel: {
        id: 'gui.aprilFools.prankLevel',
        defaultMessage: 'Prank Level',
        description: 'Label for prank level selector'
    },
    prankLevelOff: {
        id: 'gui.aprilFools.prankLevel.off',
        defaultMessage: 'Off',
        description: 'No pranks'
    },
    prankLevelMild: {
        id: 'gui.aprilFools.prankLevel.mild',
        defaultMessage: 'Mild',
        description: 'Light pranks'
    },
    prankLevelModerate: {
        id: 'gui.aprilFools.prankLevel.moderate',
        defaultMessage: 'Moderate',
        description: 'Medium pranks'
    },
    prankLevelChaos: {
        id: 'gui.aprilFools.prankLevel.chaos',
        defaultMessage: 'Maximum Chaos',
        description: 'All pranks enabled'
    },
    individualFeatures: {
        id: 'gui.aprilFools.individualFeatures',
        defaultMessage: 'Individual Features',
        description: 'Section title for individual feature toggles'
    },
    sillySounds: {
        id: 'gui.aprilFools.sillySounds',
        defaultMessage: 'Silly Sound Effects',
        description: 'Toggle for silly sound effects'
    },
    funnyBlockNames: {
        id: 'gui.aprilFools.funnyBlockNames',
        defaultMessage: 'Funny Block Names',
        description: 'Toggle for funny block names'
    },
    confettiAnimations: {
        id: 'gui.aprilFools.confettiAnimations',
        defaultMessage: 'Confetti Animations',
        description: 'Toggle for confetti animations'
    },
    rainbowMode: {
        id: 'gui.aprilFools.rainbowMode',
        defaultMessage: 'Rainbow Mode',
        description: 'Toggle for rainbow theme'
    },
    sillyTooltips: {
        id: 'gui.aprilFools.sillyTooltips',
        defaultMessage: 'Silly Tooltips',
        description: 'Toggle for funny tooltips'
    },
    upsideDownMode: {
        id: 'gui.aprilFools.upsideDownMode',
        defaultMessage: 'Upside Down Mode',
        description: 'Toggle for upside down interface'
    },
    dancingSprites: {
        id: 'gui.aprilFools.dancingSprites',
        defaultMessage: 'Dancing Sprites',
        description: 'Toggle for sprite animations'
    },
    funnyErrorMessages: {
        id: 'gui.aprilFools.funnyErrorMessages',
        defaultMessage: 'Funny Error Messages',
        description: 'Toggle for humorous error messages'
    },
    catMode: {
        id: 'gui.aprilFools.catMode',
        defaultMessage: 'Cat Mode',
        description: 'Toggle for cat-themed modifications'
    },
    fakeLoading: {
        id: 'gui.aprilFools.fakeLoading',
        defaultMessage: 'Funny Loading Messages',
        description: 'Toggle for humorous loading screens'
    },
    autoActivate: {
        id: 'gui.aprilFools.autoActivate',
        defaultMessage: 'Auto-activate on April 1st',
        description: 'Toggle for automatic April Fools activation'
    },
    resetAll: {
        id: 'gui.aprilFools.resetAll',
        defaultMessage: 'Reset All',
        description: 'Button to reset all April Fools settings'
    },
    warning: {
        id: 'gui.aprilFools.warning',
        defaultMessage: 'Note: These features are just for fun! You can disable them anytime.',
        description: 'Warning message about April Fools features'
    }
});

const AprilFoolsSettings = ({
    aprilFools,
    intl,
    onToggleAprilFools,
    onSetFeature,
    onSetPrankLevel,
    onResetAll,
    onSetAutoActivate
}) => {
    const handlePrankLevelChange = event => {
        onSetPrankLevel(event.target.value);
    };

    const handleFeatureToggle = feature => {
        onSetFeature(feature, !aprilFools.features[feature]);
    };

    const handleResetAll = () => {
        if (confirm(intl.formatMessage({
            id: 'gui.aprilFools.confirmReset',
            defaultMessage: 'Are you sure you want to reset all April Fools settings?'
        }))) {
            onResetAll();
        }
    };

    return (
        <Box className={styles.aprilFoolsSettings}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <span className={styles.emoji}>🎉</span>
                    <FormattedMessage {...messages.aprilFoolsTitle} />
                    <span className={styles.emoji}>🎉</span>
                </h3>
                <p className={styles.description}>
                    <FormattedMessage {...messages.aprilFoolsDescription} />
                </p>
            </div>

            <div className={styles.mainToggle}>
                <label className={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        checked={aprilFools.enabled}
                        onChange={onToggleAprilFools}
                        className={styles.checkbox}
                    />
                    <span className={styles.checkboxCustom} />
                    <FormattedMessage {...messages.enableAprilFools} />
                </label>
            </div>

            {aprilFools.enabled && (
                <div className={styles.settings}>
                    <div className={styles.prankLevelSection}>
                        <label className={styles.sectionLabel}>
                            <FormattedMessage {...messages.prankLevel} />
                        </label>
                        <select
                            value={aprilFools.prankLevel}
                            onChange={handlePrankLevelChange}
                            className={styles.select}
                        >
                            <option value={PRANK_LEVELS.OFF}>
                                {intl.formatMessage(messages.prankLevelOff)}
                            </option>
                            <option value={PRANK_LEVELS.MILD}>
                                {intl.formatMessage(messages.prankLevelMild)}
                            </option>
                            <option value={PRANK_LEVELS.MODERATE}>
                                {intl.formatMessage(messages.prankLevelModerate)}
                            </option>
                            <option value={PRANK_LEVELS.CHAOS}>
                                {intl.formatMessage(messages.prankLevelChaos)}
                            </option>
                        </select>
                    </div>

                    <div className={styles.featuresSection}>
                        <h4 className={styles.sectionTitle}>
                            <FormattedMessage {...messages.individualFeatures} />
                        </h4>
                        
                        <div className={styles.featureGrid}>
                            {Object.entries(APRIL_FOOLS_FEATURES).map(([key, feature]) => (
                                <label key={feature} className={styles.featureLabel}>
                                    <input
                                        type="checkbox"
                                        checked={aprilFools.features[feature]}
                                        onChange={() => handleFeatureToggle(feature)}
                                        className={styles.featureCheckbox}
                                    />
                                    <span className={styles.featureCheckboxCustom} />
                                    <span className={styles.featureText}>
                                        <FormattedMessage {...messages[feature]} />
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.autoActivateSection}>
                        <label className={styles.toggleLabel}>
                            <input
                                type="checkbox"
                                checked={aprilFools.autoActivate}
                                onChange={e => onSetAutoActivate(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxCustom} />
                            <FormattedMessage {...messages.autoActivate} />
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={handleResetAll}
                            className={styles.resetButton}
                        >
                            <FormattedMessage {...messages.resetAll} />
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.warning}>
                <span className={styles.warningIcon}>ℹ️</span>
                <FormattedMessage {...messages.warning} />
            </div>
        </Box>
    );
};

AprilFoolsSettings.propTypes = {
    aprilFools: PropTypes.shape({
        enabled: PropTypes.bool,
        prankLevel: PropTypes.string,
        features: PropTypes.object,
        autoActivate: PropTypes.bool
    }),
    intl: intlShape,
    onToggleAprilFools: PropTypes.func,
    onSetFeature: PropTypes.func,
    onSetPrankLevel: PropTypes.func,
    onResetAll: PropTypes.func,
    onSetAutoActivate: PropTypes.func
};

const mapStateToProps = state => ({
    aprilFools: state.scratchGui.aprilFools
});

const mapDispatchToProps = dispatch => ({
    onToggleAprilFools: () => dispatch(toggleAprilFools()),
    onSetFeature: (feature, enabled) => dispatch(setAprilFoolsFeature(feature, enabled)),
    onSetPrankLevel: level => dispatch(setPrankLevel(level)),
    onResetAll: () => dispatch(resetAprilFools()),
    onSetAutoActivate: enabled => dispatch(setAutoActivate(enabled))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AprilFoolsSettings));