// Legacy export format because this is used by some build-time scripts stuck in the past.
// eslint-disable-next-line import/no-commonjs
module.exports = {
    APP_NAME: 'Visual IDE', // the name of the Scratch mod
    APP_NAMES: {
        PROJECT: 'OmniBlocks'
    },
    APP_VERSION: process.env.APP_VERSION || 'v0.5.8-alpha' // Dynamically injected at build time from git tags
};
