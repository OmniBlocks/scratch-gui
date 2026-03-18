/* eslint-disable import/no-commonjs */
export const userscript = async () => {
    const {default: module} = await import(/* webpackChunkName: "addon-entry-boxy-ai" */ './userscript.js');
    return module;
};