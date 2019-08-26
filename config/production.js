const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./common')

const config = merge(common.config, {
  // devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
    }),
    new UglifyJsPlugin({
      parallel: true
    }),
    new CleanWebpackPlugin(common.paths.DIST_PATH, {
      root: common.paths.ROOT_PATH,
      exclude: ['images', 'fonts']
    }),
    new ManifestPlugin({
      fileName: 'rev-manifest.json'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      hash: false,
      cache: false,
      inject: 'body',
      chunks: ['app']
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8888,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: true,
    //   statsFilename: 'stats.json',
    //   logLevel: 'info'
    // })
  ]
})

module.exports = config