var path = require('path');
var webpack = require('webpack');

module.exports = {
    //entry: './src/js/quasiform.js',
    entry: './test/main.js',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'quasiform.min.js'
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