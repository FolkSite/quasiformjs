var path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: [/*'babel-polyfill',*/ /*'whatwg-fetch', */ 'fetch-xhr', './test/main.js'],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.min.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        //new BundleAnalyzerPlugin(),
        /*new webpack.ProvidePlugin({
            Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
            fetch: 'imports-loader?this=>global!exports-loader?global.fetch!fetch'
        }),*/
        new UglifyJSPlugin(),
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};