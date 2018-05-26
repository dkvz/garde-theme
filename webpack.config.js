// Stole most of this config from there:
// https://github.com/jalkoby/sass-webpack-plugin
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const contentBase = path.join(__dirname, 'dist');

module.exports = {
  entry: './src/app.js',
  output: {
    path: contentBase,
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: "css-loader"},
          {
            // PostCSS stuff is required by Bootstrap SCSS.
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          {loader: "sass-loader"}
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './img/[name][hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  devServer: (process.env.NODE_ENV === 'production') ? false : {
    contentBase: contentBase,
    compress: true,
    port: 8081
  },
  devtool: (process.env.NODE_ENV === 'production') ? false : 'source-map'
};