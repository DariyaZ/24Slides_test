const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const resolve = require('./resolve')

const ROOT_PATH = path.resolve(__dirname, '../')
const BASE_PATH = path.resolve(__dirname, '../')
const DIST_PATH = path.resolve(ROOT_PATH, 'build')
const IS_PROD = (process.env.NODE_ENV === 'production')

const config = {
  entry: {
    app: [
      'babel-polyfill',
      './scripts/index.js',
      './styles/main.scss'
    ]
  },

  output: {
    filename: (IS_PROD ? '[name].[chunkhash:8].js' : '[name].js'),
    chunkFilename: (IS_PROD ? '[name].[chunkhash:8].js' : '[name].js'),
    path: DIST_PATH,
    publicPath: ''
  },

  context: BASE_PATH,

  resolve,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: BASE_PATH,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: BASE_PATH,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'cache-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: IS_PROD
              }
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
              },
            },
          ],
          publicPath: '../'
        }),
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
            },
          }
        ],
      },
      {
        test: /\.(mpeg|mp4|webm)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              mimetype: 'video/webm',
              name: 'video/[name].[ext]',
            },
          }
        ],
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          }
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/octet-stream',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/svg+xml',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/' + (IS_PROD ? '[name].[chunkhash:8].css' : '[name].css'),
      disable: !IS_PROD,
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app'
    }),
  ],
}

module.exports = {
  config,
  paths: {
    ROOT_PATH,
    BASE_PATH,
    DIST_PATH,
  }
}
