const TOGGLE_OMNISCRIPT_MODE = 'scratch-gui/omniscript-mode/TOGGLE_OMNISCRIPT_MODE';

const initialState = {
    isOmniScriptMode: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case TOGGLE_OMNISCRIPT_MODE:
        return Object.assign({}, state, {
            isOmniScriptMode: action.isOmniScriptMode
        });
    default:
        return state;
    }
};

const toggleOmniScriptMode = function (isOmniScriptMode) {
    return {
        type: TOGGLE_OMNISCRIPT_MODE,
        isOmniScriptMode: isOmniScriptMode
    };
};

export {
    reducer as default,
    initialState as omniScriptModeInitialState,
    toggleOmniScriptMode
};
