const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/client/app.js',
    output: {
        libraryTarget: 'var',
        library: 'Client',
        publicPath: '/',
    },
    mode: 'development',
    // https://webpack.js.org/configuration/dev-server/#devserverproxy
    devServer: {
        proxy: {
            '/geo-name-locations': 'http://localhost:8081',
            '/weather-bit-forecast': 'http://localhost:8081',
            '/pixabay-images': 'http://localhost:8081',
            '/save-trip': 'http://localhost:8081',
            '/get-saved-trips': 'http://localhost:8081',
            '/remove-saved-trip': 'http://localhost:8081',
            '/save-search-result': 'http://localhost:8081',
            '/get-search-result': 'http://localhost:8081',
        },
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: '/.js$/',
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/client/views/index.html',
            filename: './index.html',
        }),
        new WriteFilePlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/client/icons', to: 'icons' },
                { from: 'src/client/images', to: 'images' },
            ],
        }),
        new Dotenv(),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: false,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false,
        }),
    ],
};
