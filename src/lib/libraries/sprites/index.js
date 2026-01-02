/**
 * Sprite Library for OmniBlocks
 * Contains all available sprites that users can add to their projects
 */

import boxyData from './boxy/boxy.json';
import boxyIcon from './boxy/boxy.svg';

const spriteLibrary = [
    {
        name: 'Boxy',
        md5: 'boxy.svg',
        type: 'sprite',
        tags: ['mascot', 'character', 'omniblocks'],
        info: [2, 2, 1], // [costume count, sound count, sample count]
        json: boxyData,
        icon: boxyIcon,
        description: 'The official OmniBlocks mascot - a friendly coding companion!',
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        internetConnectionRequired: false
    }
];

export default spriteLibrary;
