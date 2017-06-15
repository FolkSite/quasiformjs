var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', 'whatwg-fetch', './test/main.js'],
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
    stats: {
        colors: true
    },
    devtool: 'source-map'
};