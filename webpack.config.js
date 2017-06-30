var path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: ['fetch-xhr', './test/main.js'],
    //entry: ['fetch-xhr', './src/js/quasiform.jquery.js'],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.min.js'
        //filename: 'quasiform.min.js'
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
        /*new BundleAnalyzerPlugin(),*/
        new UglifyJSPlugin(),
    ],
    stats: {
        colors: true
    },
    //devtool: 'source-map'
};