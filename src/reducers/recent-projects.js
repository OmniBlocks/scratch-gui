/**
 * Redux reducer for managing recent projects state
 */

// Action Types
const LOAD_RECENT_PROJECTS = 'recentProjects/LOAD_RECENT_PROJECTS';
const ADD_RECENT_PROJECT = 'recentProjects/ADD_RECENT_PROJECT';
const CLEAR_RECENT_PROJECTS = 'recentProjects/CLEAR_RECENT_PROJECTS';

// Initial State
const initialState = {
    projects: []  // Array of { handle, name, timestamp }
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
    case LOAD_RECENT_PROJECTS:
        return {
            ...state,
            projects: action.projects || []
        };
    case ADD_RECENT_PROJECT:
        if (!action.project) {
            return state;
        }
        // Add to front, maintain max 5, remove duplicates by name
        const existingProjects = state.projects.filter(p => p.name !== action.project.name);
        const newProjects = [action.project, ...existingProjects].slice(0, 5);
        return {
            ...state,
            projects: newProjects
        };
    case CLEAR_RECENT_PROJECTS:
        return {
            ...state,
            projects: []
        };
    default:
        return state;
    }
};

// Action Creators
const loadRecentProjects = projects => ({
    type: LOAD_RECENT_PROJECTS,
    projects
});

const addRecentProject = project => ({
    type: ADD_RECENT_PROJECT,
    project
});

const clearRecentProjects = () => ({
    type: CLEAR_RECENT_PROJECTS
});

// Export initial state for gui.js
const recentProjectsInitialState = initialState;

export {
    reducer as default,
    recentProjectsInitialState,
    loadRecentProjects,
    addRecentProject,
    clearRecentProjects
};