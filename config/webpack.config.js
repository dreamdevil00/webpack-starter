const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isDebug = !process.argv.includes('--release');
const env = isDebug ? 'development' : 'production';

const pathsToClean = [
  path.resolve(__dirname, '../dist'),
];
const cleanOptions = {
  root: path.resolve(__dirname, '..'),
};

module.exports = {
  mode: env,
  // Manually split code using entry configuration
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    port: 9000,
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDebug ? '[name].bundle.js' : '[name].[hash].chunk.js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },
  optimization: {
    // https://webpack.js.org/guides/caching/
    // 缓存配置
    runtimeChunk: {
      name: 'manifest',
    },
    // Use the SplitChunks to dedupe and split chunks
    // https://webpack.js.org/guides/code-splitting/#prevent-duplication
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minSize: 0,
          // 至少为 2 个 chunks 的公用代码
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new HtmlWebpackPlugin({
      title: 'Demo HTML',
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // 将 css 从 js 中分离出来成为单独文件
    new MiniCssExtractPlugin({
      filename: isDebug ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDebug ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [
        isDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.resolve(__dirname, 'postcss.config.js'),
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {},
        },
      ],
    }, {
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {},
      }],
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
};
