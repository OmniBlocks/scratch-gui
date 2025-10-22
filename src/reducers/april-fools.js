const TOGGLE_APRIL_FOOLS = 'scratch-gui/april-fools/TOGGLE_APRIL_FOOLS';
const SET_APRIL_FOOLS_FEATURE = 'scratch-gui/april-fools/SET_APRIL_FOOLS_FEATURE';
const SET_PRANK_LEVEL = 'scratch-gui/april-fools/SET_PRANK_LEVEL';
const RESET_APRIL_FOOLS = 'scratch-gui/april-fools/RESET_APRIL_FOOLS';
const SET_AUTO_ACTIVATE = 'scratch-gui/april-fools/SET_AUTO_ACTIVATE';

// Prank levels
export const PRANK_LEVELS = {
    OFF: 'off',
    MILD: 'mild',
    MODERATE: 'moderate',
    CHAOS: 'chaos'
};

// Individual features
export const APRIL_FOOLS_FEATURES = {
    SILLY_SOUNDS: 'sillySounds',
    FUNNY_BLOCK_NAMES: 'funnyBlockNames',
    CONFETTI_ANIMATIONS: 'confettiAnimations',
    RAINBOW_MODE: 'rainbowMode',
    SILLY_TOOLTIPS: 'sillyTooltips',
    UPSIDE_DOWN_MODE: 'upsideDownMode',
    DANCING_SPRITES: 'dancingSprites',
    FUNNY_ERROR_MESSAGES: 'funnyErrorMessages',
    CAT_MODE: 'catMode',
    FAKE_LOADING: 'fakeLoading'
};

// Check if it's April 1st
const isAprilFools = () => {
    const now = new Date();
    return now.getMonth() === 3 && now.getDate() === 1; // April is month 3 (0-indexed)
};

// Default feature settings for each prank level
const getDefaultFeaturesForLevel = level => {
    switch (level) {
    case PRANK_LEVELS.MILD:
        return {
            [APRIL_FOOLS_FEATURES.SILLY_SOUNDS]: false,
            [APRIL_FOOLS_FEATURES.FUNNY_BLOCK_NAMES]: true,
            [APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS]: false,
            [APRIL_FOOLS_FEATURES.RAINBOW_MODE]: false,
            [APRIL_FOOLS_FEATURES.SILLY_TOOLTIPS]: true,
            [APRIL_FOOLS_FEATURES.UPSIDE_DOWN_MODE]: false,
            [APRIL_FOOLS_FEATURES.DANCING_SPRITES]: false,
            [APRIL_FOOLS_FEATURES.FUNNY_ERROR_MESSAGES]: true,
            [APRIL_FOOLS_FEATURES.CAT_MODE]: false,
            [APRIL_FOOLS_FEATURES.FAKE_LOADING]: false
        };
    case PRANK_LEVELS.MODERATE:
        return {
            [APRIL_FOOLS_FEATURES.SILLY_SOUNDS]: true,
            [APRIL_FOOLS_FEATURES.FUNNY_BLOCK_NAMES]: true,
            [APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS]: true,
            [APRIL_FOOLS_FEATURES.RAINBOW_MODE]: false,
            [APRIL_FOOLS_FEATURES.SILLY_TOOLTIPS]: true,
            [APRIL_FOOLS_FEATURES.UPSIDE_DOWN_MODE]: false,
            [APRIL_FOOLS_FEATURES.DANCING_SPRITES]: true,
            [APRIL_FOOLS_FEATURES.FUNNY_ERROR_MESSAGES]: true,
            [APRIL_FOOLS_FEATURES.CAT_MODE]: false,
            [APRIL_FOOLS_FEATURES.FAKE_LOADING]: true
        };
    case PRANK_LEVELS.CHAOS:
        return {
            [APRIL_FOOLS_FEATURES.SILLY_SOUNDS]: true,
            [APRIL_FOOLS_FEATURES.FUNNY_BLOCK_NAMES]: true,
            [APRIL_FOOLS_FEATURES.CONFETTI_ANIMATIONS]: true,
            [APRIL_FOOLS_FEATURES.RAINBOW_MODE]: true,
            [APRIL_FOOLS_FEATURES.SILLY_TOOLTIPS]: true,
            [APRIL_FOOLS_FEATURES.UPSIDE_DOWN_MODE]: true,
            [APRIL_FOOLS_FEATURES.DANCING_SPRITES]: true,
            [APRIL_FOOLS_FEATURES.FUNNY_ERROR_MESSAGES]: true,
            [APRIL_FOOLS_FEATURES.CAT_MODE]: true,
            [APRIL_FOOLS_FEATURES.FAKE_LOADING]: true
        };
    default: // OFF
        return Object.keys(APRIL_FOOLS_FEATURES).reduce((acc, key) => {
            acc[APRIL_FOOLS_FEATURES[key]] = false;
            return acc;
        }, {});
    }
};

export const aprilFoolsInitialState = {
    enabled: isAprilFools(), // Auto-enable on April 1st
    prankLevel: isAprilFools() ? PRANK_LEVELS.MILD : PRANK_LEVELS.OFF,
    autoActivate: true, // Whether to auto-activate on April 1st
    features: getDefaultFeaturesForLevel(isAprilFools() ? PRANK_LEVELS.MILD : PRANK_LEVELS.OFF),
    lastActivated: null, // Timestamp of last activation
    userHasBeenNotified: false // Whether user has been notified about April Fools activation
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = aprilFoolsInitialState;
    
    switch (action.type) {
    case TOGGLE_APRIL_FOOLS:
        return Object.assign({}, state, {
            enabled: !state.enabled,
            prankLevel: !state.enabled ? PRANK_LEVELS.MILD : PRANK_LEVELS.OFF,
            features: getDefaultFeaturesForLevel(!state.enabled ? PRANK_LEVELS.MILD : PRANK_LEVELS.OFF),
            lastActivated: !state.enabled ? Date.now() : state.lastActivated
        });
        
    case SET_APRIL_FOOLS_FEATURE:
        return Object.assign({}, state, {
            features: Object.assign({}, state.features, {
                [action.feature]: action.enabled
            })
        });
        
    case SET_PRANK_LEVEL:
        return Object.assign({}, state, {
            prankLevel: action.level,
            enabled: action.level !== PRANK_LEVELS.OFF,
            features: getDefaultFeaturesForLevel(action.level),
            lastActivated: action.level !== PRANK_LEVELS.OFF ? Date.now() : state.lastActivated
        });
        
    case RESET_APRIL_FOOLS:
        return Object.assign({}, state, {
            enabled: false,
            prankLevel: PRANK_LEVELS.OFF,
            features: getDefaultFeaturesForLevel(PRANK_LEVELS.OFF)
        });
        
    case SET_AUTO_ACTIVATE:
        return Object.assign({}, state, {
            autoActivate: action.enabled
        });
        
    default:
        return state;
    }
};

// Action creators
export const toggleAprilFools = () => ({
    type: TOGGLE_APRIL_FOOLS
});

export const setAprilFoolsFeature = (feature, enabled) => ({
    type: SET_APRIL_FOOLS_FEATURE,
    feature,
    enabled
});

export const setPrankLevel = level => ({
    type: SET_PRANK_LEVEL,
    level
});

export const resetAprilFools = () => ({
    type: RESET_APRIL_FOOLS
});

export const setAutoActivate = enabled => ({
    type: SET_AUTO_ACTIVATE,
    enabled
});

export default reducer;