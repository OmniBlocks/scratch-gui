/**
 * @fileoverview
 * Utility function to detect tutorial id from query paramenter on the URL.
 * tw: tutorials system removed - functions now return null
 */

/**
 * Get the tutorial id from the given numerical id (representing the
 * url id of the tutorial).
 * @param {number} urlId The URL Id for the tutorial
 * @returns {string} The string id for the tutorial, or null if the URL ID
 * was not found.
 */
const getDeckIdFromUrlId = urlId => { // eslint-disable-line no-unused-vars
    // tw: tutorials system removed
    return null;
};

/**
 * Check if there's a tutorial id provided as a query parameter in the URL.
 * Return the corresponding tutorial id or null if not found.
 * @param {object} queryParams the results of parsing the query string
 * @return {string} The ID of the requested tutorial or null if no tutorial was
 * requested or found.
 */
const detectTutorialId = queryParams => { // eslint-disable-line no-unused-vars
    // tw: tutorials system removed
    return null;
};

export {
    detectTutorialId
};
