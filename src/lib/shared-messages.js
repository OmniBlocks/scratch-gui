import {defineMessages} from 'react-intl';

export default defineMessages({
    backdrop: {
        defaultMessage: 'backdrop{index}',
        description: 'Default name for a new backdrop, scratch will automatically adjust the number if necessary',
        id: 'gui.sharedMessages.backdrop'
    },
    costume: {
        defaultMessage: 'costume{index}',
        description: 'Default name for a new costume, scratch will automatically adjust the number if necessary',
        id: 'gui.sharedMessages.costume'
    },
    sprite: {
        defaultMessage: 'Sprite{index}',
        description: 'Default name for a new sprite, scratch will automatically adjust the number if necessary',
        id: 'gui.sharedMessages.sprite'
    },
    pop: {
        defaultMessage: 'pop',
        description: 'Name of the pop sound, the default sound added to a sprite',
        id: 'gui.sharedMessages.pop'
    },
    replaceProjectWarning: {
        id: 'gui.sharedMessages.replaceProjectWarning',
        defaultMessage: 'Replace contents of the current project?',
        description: 'Confirmation that user wants to overwrite the current project contents'
    },
    loadFromComputerTitle: {
        id: 'gui.sharedMessages.loadFromComputerTitle',
        defaultMessage: 'Load from your computer',
        description: 'Title for uploading a project from your computer'
    },
    recentProjects: {
        id: 'gui.menuBar.recentProjects',
        defaultMessage: 'Recent Projects',
        description: 'Menu item for opening recent projects'
    },
    noRecentProjects: {
        id: 'gui.menuBar.noRecentProjects',
        defaultMessage: 'No recent projects',
        description: 'Message shown when there are no recent projects'
    },
    clearRecentProjects: {
        id: 'gui.menuBar.clearRecentProjects',
        defaultMessage: 'Clear Recent Projects',
        description: 'Menu item to clear the recent projects list'
    },
    openRecentProjectError: {
        id: 'gui.menuBar.openRecentProjectError',
        defaultMessage: 'Could not open recent project',
        description: 'Error message when opening a recent project fails'
    }
});
