module.exports = {
    extends: ['scratch', 'scratch/node', 'scratch/es6'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        },
        babelOptions: {
            presets: ['@babel/preset-react']
        }
    }
};
