const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./common')

const config = merge(common.config, {
  devtool: 'cheap-module-source-map',

  watchOptions: {
    ignored: /node_modules/,
    poll: true
  },

  devServer: {
    hot: true,
    contentBase: common.paths.BASE_PATH,
    publicPath: '/',
    host: '0.0.0.0',
    port: 3001,
    historyApiFallback: true,
    disableHostCheck: true,
    overlay: true
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      hash: false,
      cache: false,
      inject: 'body',
      chunks: ['app']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
})

module.exports = config