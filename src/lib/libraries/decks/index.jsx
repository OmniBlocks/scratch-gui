import {defineMessages} from 'react-intl';
import {enImages} from './en-steps.js';

// Import thumbnail images
import gettingStartedThumbnail from './thumbnails/getting-started.jpg';
import animateNameThumbnail from './thumbnails/animate-a-name.jpg';
import makeMusicThumbnail from './thumbnails/make-music.jpg';
import chaseGameThumbnail from './thumbnails/chase-game.jpg';
import popGameThumbnail from './thumbnails/pop-game.jpg';
import animateCharacterThumbnail from './thumbnails/animate-a-character.jpg';
import tellStoryThumbnail from './thumbnails/tell-a-story.jpg';
import videoSensingThumbnail from './thumbnails/video-sensing.jpg';
import makeItFlyThumbnail from './thumbnails/make-it-fly.jpg';
import pongThumbnail from './thumbnails/pong.jpg';
import imagineThumbnail from './thumbnails/imagine.jpg';
import codeCartoonThumbnail from './thumbnails/code-a-cartoon.jpg';
import talkingThumbnail from './thumbnails/talking.png';
import addBackdropThumbnail from './thumbnails/add-backdrop.jpg';
import addEffectsThumbnail from './thumbnails/add-effects.jpg';
import hideShowThumbnail from './thumbnails/hide-and-show.jpg';
import changeSizeThumbnail from './thumbnails/change-size.jpg';
import spinThumbnail from './thumbnails/spin.jpg';
import recordSoundThumbnail from './thumbnails/record-a-sound.jpg';
import moveArrowKeysThumbnail from './thumbnails/move-arrow-keys.jpg';
import glideAroundThumbnail from './thumbnails/glide-around.jpg';

const messages = defineMessages({
    // Getting Started
    gettingStartedName: {
        defaultMessage: 'Getting Started',
        description: 'Name for the "Getting Started" tutorial',
        id: 'gui.howtos.intro.name'
    },
    gettingStartedDescription: {
        defaultMessage: 'Get started with Scratch',
        description: 'Description for the "Getting Started" tutorial',
        id: 'gui.howtos.intro.description'
    },
    
    // Animate a Name
    animateNameName: {
        defaultMessage: 'Animate a Name',
        description: 'Name for the "Animate a Name" tutorial',
        id: 'gui.howtos.animate-a-name.name'
    },
    animateNameDescription: {
        defaultMessage: 'Animate the letters of your name, initials, or favorite word.',
        description: 'Description for the "Animate a Name" tutorial',
        id: 'gui.howtos.animate-a-name.description'
    },
    
    // Make Music
    makeMusicName: {
        defaultMessage: 'Make Music',
        description: 'Name for the "Make Music" tutorial',
        id: 'gui.howtos.make-music.name'
    },
    makeMusicDescription: {
        defaultMessage: 'Choose instruments, add sounds, and press keys to play music.',
        description: 'Description for the "Make Music" tutorial',
        id: 'gui.howtos.make-music.description'
    },
    
    // Chase Game
    chaseGameName: {
        defaultMessage: 'Make a Chase Game',
        description: 'Name for the "Make a Chase Game" tutorial',
        id: 'gui.howtos.chase-game.name'
    },
    chaseGameDescription: {
        defaultMessage: 'Make a game where you chase a character to score points.',
        description: 'Description for the "Make a Chase Game" tutorial',
        id: 'gui.howtos.chase-game.description'
    }
});

export default {
    'intro': {
        name: messages.gettingStartedName,
        img: gettingStartedThumbnail,
        tags: ['animation'],
        urlId: 1,
        steps: [
            {
                title: messages.gettingStartedName,
                image: enImages.introMove,
                deckIds: [
                    'intro-move-sayhello-backdrop'
                ]
            },
            {
                title: messages.gettingStartedName,
                image: enImages.introSay,
                deckIds: [
                    'intro-move-sayhello-backdrop'
                ]
            },
            {
                title: messages.gettingStartedName,
                image: enImages.introGreenFlag,
                deckIds: [
                    'intro-move-sayhello-backdrop'
                ]
            }
        ]
    },
    
    'animate-a-name': {
        name: messages.animateNameName,
        img: animateNameThumbnail,
        tags: ['animation'],
        urlId: 2,
        steps: [
            {
                title: messages.animateNameName,
                image: enImages.namePickLetter,
                deckIds: [
                    'animate-a-name'
                ]
            },
            {
                title: messages.animateNameName,
                image: enImages.namePlaySound,
                deckIds: [
                    'animate-a-name'
                ]
            },
            {
                title: messages.animateNameName,
                image: enImages.namePickLetter2,
                deckIds: [
                    'animate-a-name'
                ]
            },
            {
                title: messages.animateNameName,
                image: enImages.nameChangeColor,
                deckIds: [
                    'animate-a-name'
                ]
            },
            {
                title: messages.animateNameName,
                image: enImages.nameSpin,
                deckIds: [
                    'animate-a-name'
                ]
            },
            {
                title: messages.animateNameName,
                image: enImages.nameGrow,
                deckIds: [
                    'animate-a-name'
                ]
            }
        ]
    },
    
    'make-music': {
        name: messages.makeMusicName,
        img: makeMusicThumbnail,
        tags: ['music'],
        urlId: 3,
        steps: [
            {
                title: messages.makeMusicName,
                image: enImages.musicPickInstrument,
                deckIds: [
                    'make-music'
                ]
            },
            {
                title: messages.makeMusicName,
                image: enImages.musicPlaySound,
                deckIds: [
                    'make-music'
                ]
            },
            {
                title: messages.makeMusicName,
                image: enImages.musicMakeSong,
                deckIds: [
                    'make-music'
                ]
            },
            {
                title: messages.makeMusicName,
                image: enImages.musicMakeBeat,
                deckIds: [
                    'make-music'
                ]
            },
            {
                title: messages.makeMusicName,
                image: enImages.musicMakeBeatbox,
                deckIds: [
                    'make-music'
                ]
            }
        ]
    },
    
    'chase-game': {
        name: messages.chaseGameName,
        img: chaseGameThumbnail,
        tags: ['games'],
        urlId: 4,
        steps: [
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameAddBackdrop,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameAddSprite1,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameRightLeft,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameUpDown,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameAddSprite2,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameMoveRandomly,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGamePlaySound,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameAddVariable,
                deckIds: [
                    'chase-game'
                ]
            },
            {
                title: messages.chaseGameName,
                image: enImages.chaseGameChangeScore,
                deckIds: [
                    'chase-game'
                ]
            }
        ]
    }
};