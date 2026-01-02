const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            clean: true,
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(svg|png|jpg|jpeg|gif)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[name].[hash][ext]'
                    }
                },
                {
                    test: /\.json$/,
                    type: 'json'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './static/index.html',
                filename: 'index.html'
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'static'),
            },
            port: 8601,
            hot: true,
            open: true,
            historyApiFallback: true
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map'
    };
};
