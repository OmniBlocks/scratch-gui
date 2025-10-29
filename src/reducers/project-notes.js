const SET_PROJECT_NOTES = 'scratch-gui/project-notes/SET_PROJECT_NOTES';
const CLEAR_PROJECT_NOTES = 'scratch-gui/project-notes/CLEAR_PROJECT_NOTES';

const initialState = {
    content: '',
    hasNotes: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROJECT_NOTES:
        return Object.assign({}, state, {
            content: action.content,
            hasNotes: action.content && action.content.trim().length > 0
        });
    case CLEAR_PROJECT_NOTES:
        return Object.assign({}, state, {
            content: '',
            hasNotes: false
        });
    default:
        return state;
    }
};

const setProjectNotes = function (content) {
    return {
        type: SET_PROJECT_NOTES,
        content: content || ''
    };
};

const clearProjectNotes = function () {
    return {
        type: CLEAR_PROJECT_NOTES
    };
};

export {
    reducer as default,
    initialState as projectNotesInitialState,
    setProjectNotes,
    clearProjectNotes
};