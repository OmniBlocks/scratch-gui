/**
 * April Fools text replacements for funny block names and messages
 */

// Funny block name replacements
export const FUNNY_BLOCK_NAMES = {
    // Motion blocks
    'move %1 steps': 'wiggle %1 steps 🕺',
    'turn right %1 degrees': 'spin right %1 degrees ↻',
    'turn left %1 degrees': 'spin left %1 degrees ↺',
    'go to x: %1 y: %2': 'teleport to x: %1 y: %2 ✨',
    'glide %1 secs to x: %2 y: %3': 'slide %1 secs to x: %2 y: %3 🛷',
    'point in direction %1': 'face direction %1 👀',
    'point towards %1': 'look at %1 👁️',
    'change x by %1': 'nudge x by %1 👈',
    'set x to %1': 'put x at %1 📍',
    'change y by %1': 'nudge y by %1 👆',
    'set y to %1': 'put y at %1 📍',
    'if on edge, bounce': 'if hitting wall, boing! 🏀',
    'set rotation style %1': 'set spin style %1 🌪️',

    // Looks blocks
    'say %1 for %2 seconds': 'chat %1 for %2 seconds 💬',
    'say %1': 'chat %1 💬',
    'think %1 for %2 seconds': 'ponder %1 for %2 seconds 🤔',
    'think %1': 'ponder %1 🤔',
    'switch costume to %1': 'change outfit to %1 👗',
    'next costume': 'next outfit 👔',
    'switch backdrop to %1': 'change scene to %1 🎭',
    'next backdrop': 'next scene 🎬',
    'change %1 effect by %2': 'add %2 %1 magic ✨',
    'set %1 effect to %2': 'make %1 effect %2 🎨',
    'clear graphic effects': 'remove all magic ✨',
    'change size by %1': 'grow by %1% 📏',
    'set size to %1%': 'resize to %1% 📐',
    'go to %1 layer': 'jump to %1 layer 🦘',
    'go %1 %2 layers': 'hop %1 %2 layers 🐸',

    // Sound blocks
    'play sound %1': 'make noise %1 🔊',
    'play sound %1 until done': 'play tune %1 until finished 🎵',
    'stop all sounds': 'silence everything 🤫',
    'change %1 effect by %2': 'tweak %1 by %2 🎛️',
    'set %1 effect to %2': 'set %1 to %2 🎚️',
    'clear sound effects': 'reset audio magic 🎧',
    'change volume by %1': 'adjust loudness by %1 📢',
    'set volume to %1%': 'set loudness to %1% 🔉',

    // Events blocks
    'when %1 clicked': 'when %1 gets clicked 👆',
    'when %1 key pressed': 'when %1 key gets pressed ⌨️',
    'when this sprite clicked': 'when I get poked 👉',
    'when backdrop switches to %1': 'when scene changes to %1 🎬',
    'when %1 > %2': 'when %1 becomes bigger than %2 📈',
    'when I receive %1': 'when I hear %1 📻',
    'broadcast %1': 'shout %1 📢',
    'broadcast %1 and wait': 'yell %1 and wait 📣',

    // Control blocks
    'wait %1 seconds': 'chill for %1 seconds 😴',
    'repeat %1': 'do %1 times 🔄',
    'forever': 'keep going forever ♾️',
    'if %1 then': 'if %1 happens then 🤷',
    'if %1 then %2 else': 'if %1 then %2 otherwise 🤔',
    'wait until %1': 'wait until %1 happens ⏰',
    'repeat until %1': 'keep doing until %1 🔁',
    'stop %1': 'halt %1 ✋',
    'when I start as a clone': 'when I get copied 👥',
    'create clone of %1': 'duplicate %1 📋',
    'delete this clone': 'delete this copy 🗑️',

    // Sensing blocks
    'touching %1?': 'bumping into %1? 🤝',
    'touching color %1?': 'touching color %1? 🎨',
    'color %1 is touching %2?': 'color %1 meets %2? 🌈',
    'distance to %1': 'how far to %1 📏',
    'ask %1 and wait': 'question %1 and wait ❓',
    'answer': 'what they said 💭',
    'key %1 pressed?': 'key %1 being pressed? ⌨️',
    'mouse down?': 'mouse clicked? 🖱️',
    'mouse x': 'mouse sideways position 🖱️',
    'mouse y': 'mouse up-down position 🖱️',
    'set drag mode %1': 'set dragging %1 ✋',
    'loudness': 'how loud it is 📢',
    'timer': 'stopwatch ⏱️',
    'reset timer': 'restart stopwatch ⏱️',
    '%1 of %2': '%1 info about %2 📊',
    'current %1': 'right now %1 📅',
    'days since 2000': 'days since Y2K 📆',
    'username': 'my name tag 👤',

    // Operators blocks
    '%1 + %2': '%1 plus %2 ➕',
    '%1 - %2': '%1 minus %2 ➖',
    '%1 * %2': '%1 times %2 ✖️',
    '%1 / %2': '%1 divided by %2 ➗',
    'pick random %1 to %2': 'random number %1 to %2 🎲',
    '%1 > %2': '%1 bigger than %2 📈',
    '%1 < %2': '%1 smaller than %2 📉',
    '%1 = %2': '%1 equals %2 ⚖️',
    '%1 and %2': '%1 and also %2 🤝',
    '%1 or %2': '%1 or maybe %2 🤷',
    'not %1': 'opposite of %1 🙃',
    'join %1 %2': 'stick together %1 %2 🔗',
    'letter %1 of %2': 'character %1 of %2 📝',
    'length of %1': 'how long is %1 📏',
    '%1 contains %2?': '%1 has %2 inside? 📦',
    '%1 mod %2': '%1 leftover %2 🍰',
    'round %1': 'round off %1 🔄',
    '%1 of %2': '%1 function of %2 🧮',

    // Variables blocks
    'set %1 to %2': 'make %1 equal %2 📝',
    'change %1 by %2': 'adjust %1 by %2 📊',
    'show variable %1': 'display %1 👁️',
    'hide variable %1': 'hide %1 🙈',

    // My Blocks (custom procedures)
    'define %1': 'create new block %1 🔧'
};

// Funny error messages
export const FUNNY_ERROR_MESSAGES = {
    'Project could not load': 'Oops! The project is taking a nap 😴 Try waking it up!',
    'Failed to save project': 'The save button is feeling shy today 🙈 Give it another try!',
    'Connection lost': 'The internet went to get snacks 🍪 It should be back soon!',
    'Invalid file format': 'This file speaks a different language 🗣️ Try a .sb3 file instead!',
    'File too large': 'This file ate too much pizza 🍕 Try a smaller one!',
    'Permission denied': 'The computer said "no thank you" 🚫 Check your permissions!',
    'Network error': 'The internet is playing hide and seek 🙈 Check your connection!',
    'Timeout error': 'The request got distracted by a butterfly 🦋 Try again!',
    'Unknown error': 'Something mysterious happened 🔮 The computer is confused too!',
    'Browser not supported': 'Your browser needs a software update hug 🤗',
    'WebGL not available': 'Your graphics card is taking a coffee break ☕',
    'Audio not available': 'The sound system is having a quiet moment 🤫',
    'Camera not found': 'The camera is playing hide and seek 📷',
    'Microphone not found': 'The microphone went on vacation 🎤',
    'Extension failed to load': 'The extension got stage fright 😰 Try refreshing!',
    'Compilation error': 'The code got tangled up 🍝 Check for typos!',
    'Runtime error': 'Something went wonky during execution 🤪',
    'Memory error': 'The computer ran out of brain space 🧠 Try closing other tabs!',
    'Disk full': 'Your computer ate too much data 💾 Time for a digital diet!',
    'Access denied': 'The file said "you shall not pass!" 🧙‍♂️'
};

// Funny loading messages
export const FUNNY_LOADING_MESSAGES = [
    '🐱 Teaching cats to code...',
    '🚀 Launching creativity rockets...',
    '🎨 Mixing digital paint...',
    '🧙‍♂️ Casting coding spells...',
    '🍕 Downloading more pizza...',
    '🦄 Summoning unicorns...',
    '🎪 Setting up the circus...',
    '🎭 Rehearsing the show...',
    '🎮 Powering up the fun...',
    '🌈 Painting rainbows...',
    '⚡ Charging creativity batteries...',
    '🎵 Tuning the music...',
    '🎯 Aiming for awesome...',
    '🎪 Juggling pixels...',
    '🎨 Sharpening digital pencils...',
    '🚂 All aboard the code train...',
    '🎪 Training the code monkeys...',
    '🎭 Putting on the show...',
    '🎪 Balancing the bits...',
    '🎨 Coloring outside the lines...'
];

// Funny tooltips
export const FUNNY_TOOLTIPS = {
    'Green Flag': 'The magic "GO!" button ✨ Click to start the show!',
    'Stop': 'The "WHOA THERE!" button 🛑 Stops everything in its tracks!',
    'File': 'Where all your creative treasures live 📁',
    'Edit': 'The "make it better" menu 🔧',
    'Tutorials': 'Your friendly coding guides 🧭',
    'Sprite': 'Your digital puppet 🎭 Make it dance!',
    'Stage': 'The theater where magic happens 🎪',
    'Costumes': 'Dress-up time for your sprite 👗',
    'Sounds': 'The noise maker 🔊 Beep boop!',
    'Code': 'Where the magic spells live ✨',
    'Backpack': 'Your coding toolbox 🎒',
    'Zoom In': 'Make everything BIGGER! 🔍',
    'Zoom Out': 'Make everything smaller 🔍',
    'Full Screen': 'Take over the whole screen! 📺',
    'Save': 'Keep your masterpiece safe 💾',
    'Share': 'Show off your creation! 🌟',
    'See Inside': 'Peek behind the curtain 👀',
    'Remix': 'Make it your own! 🎨',
    'Add Extension': 'Get more superpowers! ⚡',
    'My Stuff': 'Your personal gallery 🖼️',
    'Account': 'Your digital identity card 👤'
};

/**
 * Get a funny replacement for a block name
 * @param {string} originalText - The original block text
 * @returns {string} - The funny replacement or original text
 */
export const getFunnyBlockName = originalText => {
    return FUNNY_BLOCK_NAMES[originalText] || originalText;
};

/**
 * Get a funny error message
 * @param {string} originalError - The original error message
 * @returns {string} - The funny replacement or original error
 */
export const getFunnyErrorMessage = originalError => {
    // Try exact match first
    if (FUNNY_ERROR_MESSAGES[originalError]) {
        return FUNNY_ERROR_MESSAGES[originalError];
    }
    
    // Try partial matches for common error patterns
    for (const [pattern, replacement] of Object.entries(FUNNY_ERROR_MESSAGES)) {
        if (originalError.toLowerCase().includes(pattern.toLowerCase())) {
            return replacement;
        }
    }
    
    return originalError;
};

/**
 * Get a random funny loading message
 * @returns {string} - A random loading message
 */
export const getRandomLoadingMessage = () => {
    return FUNNY_LOADING_MESSAGES[Math.floor(Math.random() * FUNNY_LOADING_MESSAGES.length)];
};

/**
 * Get a funny tooltip
 * @param {string} originalTooltip - The original tooltip text
 * @returns {string} - The funny replacement or original tooltip
 */
export const getFunnyTooltip = originalTooltip => {
    return FUNNY_TOOLTIPS[originalTooltip] || originalTooltip;
};

/**
 * Apply April Fools text transformations to any text
 * @param {string} text - The original text
 * @param {string} type - The type of text ('block', 'error', 'tooltip', 'loading')
 * @returns {string} - The transformed text
 */
export const applyAprilFoolsText = (text, type = 'block') => {
    switch (type) {
    case 'block':
        return getFunnyBlockName(text);
    case 'error':
        return getFunnyErrorMessage(text);
    case 'tooltip':
        return getFunnyTooltip(text);
    case 'loading':
        return getRandomLoadingMessage();
    default:
        return text;
    }
};