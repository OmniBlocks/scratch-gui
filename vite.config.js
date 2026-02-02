import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';
import fs from 'fs';
import {APP_NAME} from './src/lib/brand';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
    // Load env variables similar to process.env
    const env = loadEnv(mode, process.cwd(), '');
    const root = env.ROOT || '';
    const isProd = mode === 'production';

    return {
        base: root || '/',
        plugins: [
            react({
                babel: {
                    plugins: [
                        ['react-intl', { messagesDir: './translations/messages/' }]
                    ],
                }
            }),
            createHtmlPlugin({
                minify: isProd,
                pages: [
                    { entry: 'src/playground/addon-settings.jsx', filename: 'addons.html', template: 'index.html' },
                    { entry: 'src/playground/credits.jsx', filename: 'credits.html', template: 'index.html' }
                ]
            }),
            viteStaticCopy({
                targets: [
                    { src: 'node_modules/scratch-blocks/media/*', dest: 'static/blocks-media/default' },
                    { src: 'node_modules/scratch-blocks/media/*', dest: 'static/blocks-media/high-contrast' },
                    { src: 'src/lib/themes/blocks/high-contrast-media/blocks-media/*', dest: 'static/blocks-media/high-contrast' },
                    { src: 'static/*', dest: '' }
                ]
            })
        ],
        resolve: {
            alias: {
                'text-encoding': path.resolve(__dirname, 'src/lib/tw-text-encoder'),
                'scratch-render-fonts': path.resolve(__dirname, 'src/lib/tw-scratch-render-fonts'),
            }
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
            'process.env.DEBUG': JSON.stringify(env.DEBUG === 'true'),
            'process.env.APP_VERSION': JSON.stringify(pkg.version),
            'process.env.ROUTING_STYLE': JSON.stringify(env.ROUTING_STYLE || 'filehash'),
        },
        css: {
            modules: {
                filter: (id) => id.endsWith('.css') && !id.includes('node_modules'),
                scopeBehaviour: "local",
                generateScopedName: '[name]_[local]_[hash:base64:5]',
                localsConvention: 'camelCaseOnly'
            },
            postcss: {
                plugins: [
                    require('postcss-import'),
                    require('postcss-simple-vars'),
                    require('autoprefixer')
                ]
            }
        },
        build: {
            outDir: isProd ? 'dist' : 'build',
            assetsDir: `js`,
            sourcemap: env.SOURCEMAP === 'true',
            rollupOptions: {
                external: isProd ? ['react', 'react-dom'] : [],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM'
                    }
                }
            }
        },
        server: {
            port: parseInt(env.PORT) || 8601,
            host: '0.0.0.0',
            hmr: true
        }
    };
});