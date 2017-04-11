const path = require('path')
const webpack = require('webpack')
const publicPath = 'http://localhost:4002/'
const CopyWebpackPlugin = require('copy-webpack-plugin')

const env = process.env.MIX_ENV || 'dev'
const prod = env === 'prod'

const appEntry = path.join(__dirname, 'js', 'main.js');

const DEV_ENTRIES = [
  // Activate React HMR Support
  'react-hot-loader/patch',
  // Bundle the client for webpack-dev-server and connect
  // to the provided endpoint.
  'webpack-dev-server/client?http://localhost:4002',
  // Bundle the client for hot-reloading on only for successful updates.
  'webpack/hot/only-dev-server',
];

var plugins = [
  new CopyWebpackPlugin([{ from: path.join(__dirname,'static') }]),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    __PROD: prod,
    __DEV: env === 'dev'
  })
];

if (!prod) plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = {
  devtool: prod ? false : 'cheap-module-eval-source-map',
  entry: {
    app: prod ? appEntry : DEV_ENTRIES.concat([appEntry]),
  },
  output: {
    path:  path.join(__dirname, '..', 'priv', 'static', 'js'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      'js',
    ],
    extensions: ['*', '.js', '.jsx'],
    alias: {
      phoenix: path.join(__dirname, '..', 'deps', 'phoenix', 'priv', 'static', 'phoenix.js')
    },
  },
  resolveLoader: {
    modules: [path.join(__dirname, "node_modules")]
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ]
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'js'),
        exclude: /node_modules/,
      },
    ]
  },
  devServer: {
    hot: true,
    overlay: true,
    port: 4002,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
  }
};
