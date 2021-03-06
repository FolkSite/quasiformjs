const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: ['fetch-xhr', './test/main.js'],
  //entry: ['fetch-xhr', './src/js/quasiform.jquery.js'],
  target: 'web',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'bundle.min.js'
    //filename: 'quasiform.min.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          ['env', {
            targets: {
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 11',
              ],
            },
            modules: false,
            useBuiltIns: true,
          }],
        ],
      },
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