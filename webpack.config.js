// Stole most of this config from there:
// https://github.com/jalkoby/sass-webpack-plugin
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const contentBase = path.join(__dirname, 'dist');

module.exports = {
  entry: './src/app.js',
  output: {
    path: contentBase,
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader','postcss-loader','sass-loader']
      })
    }]
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
    }),
    new ExtractTextPlugin("[name][contenthash].css")
  ],
  devServer: (process.env.NODE_ENV === 'production') ? false : {
    contentBase: contentBase,
    compress: true,
    port: 8081
  },
  devtool: (process.env.NODE_ENV === 'production') ? false : 'source-map'
};