const SET_GIT_REPO = 'scratch-gui/git/SET_GIT_REPO';
const SET_GIT_STATUS = 'scratch-gui/git/SET_GIT_STATUS';
const SET_GIT_BRANCH = 'scratch-gui/git/SET_GIT_BRANCH';
const SET_GIT_LOADING = 'scratch-gui/git/SET_GIT_LOADING';

const initialState = {
    repo: null, // URL or local path info
    status: [], // list of changed files
    branch: 'main',
    loading: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_GIT_REPO:
        return Object.assign({}, state, {
            repo: action.repo
        });
    case SET_GIT_STATUS:
        return Object.assign({}, state, {
            status: action.status
        });
    case SET_GIT_BRANCH:
        return Object.assign({}, state, {
            branch: action.branch
        });
    case SET_GIT_LOADING:
        return Object.assign({}, state, {
            loading: action.loading
        });
    default:
        return state;
    }
};

const setGitRepo = function (repo) {
    return {
        type: SET_GIT_REPO,
        repo: repo
    };
};

const setGitStatus = function (status) {
    return {
        type: SET_GIT_STATUS,
        status: status
    };
};

const setGitBranch = function (branch) {
    return {
        type: SET_GIT_BRANCH,
        branch: branch
    };
};

const setGitLoading = function (loading) {
    return {
        type: SET_GIT_LOADING,
        loading: loading
    };
};

export {
    reducer as default,
    initialState as gitInitialState,
    setGitRepo,
    setGitStatus,
    setGitBranch,
    setGitLoading
};
