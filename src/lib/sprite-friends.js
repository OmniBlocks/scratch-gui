/**
 * Sprite Friends Management System
 * Inspired by Gobo's friends (Pico, Nano, Tera, Giga) from Scratch
 */

// Default friend groups based on classic Scratch characters
export const DEFAULT_FRIEND_GROUPS = {
    'gobo-friends': {
        name: 'Gobo\'s Friends',
        members: ['Gobo', 'Pico', 'Nano', 'Tera', 'Giga'],
        description: 'The classic Scratch characters'
    }
};

/**
 * Create sprite friend relationships
 * @param {Object} sprites - Current sprites in the project
 * @returns {Object} Friend relationships mapping
 */
export const createSpriteFriends = (sprites) => {
    const friends = {};
    
    // Auto-detect classic Scratch characters and group them
    const classicNames = ['Gobo', 'Pico', 'Nano', 'Tera', 'Giga'];
    const foundClassics = [];
    
    Object.values(sprites).forEach(sprite => {
        if (classicNames.includes(sprite.name)) {
            foundClassics.push(sprite.id);
        }
    });
    
    // If we have 2 or more classic characters, make them friends
    if (foundClassics.length >= 2) {
        foundClassics.forEach(spriteId => {
            friends[spriteId] = foundClassics.filter(id => id !== spriteId);
        });
    }
    
    return friends;
};

/**
 * Check if a sprite name is a classic Scratch character
 */
export const isClassicCharacter = (name) => {
    return ['Gobo', 'Pico', 'Nano', 'Tera', 'Giga'].includes(name);
};
