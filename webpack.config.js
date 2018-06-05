// Stole a good part of this config from there:
// https://github.com/jalkoby/sass-webpack-plugin
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const contentBase = path.join(__dirname, 'dist');

// Is your plan to never, ever split this config file into 
// multiple files ?
// Yes. That is my plan. Thanks for asking.

// Supported languages:
const languages = ['fr', 'en'];
// The main index page will be generated using the
// default language.
const defaultLanguage = 'fr';

// Generates config objects for HtmlWebpackPlugin instances:
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: false
}
function hwpConf(lang, page) {
  return {
    template: './src/pages/' + page + '.hbs',
    filename: lang + '/' + page + '.html',
    minify: (process.env.NODE_ENV === 'production') ? minifyOptions : false,
    chunks: ['app'],
    lang: lang,
    page: page
  };
}

const config = {
  entry: {
    app: './src/app.js',
    languageDetection: './src/language-detection.js'
  },
  output: {
    path: contentBase,
    publicPath: '/',
    filename: '[name].js'
  },
  // We need all that stuff for SASS.
  // I already regret using it.
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
              name: 'static/[name][hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
            helperDirs: path.join(__dirname, 'src/helpers'),
            partialDirs: path.join(__dirname, 'src/partials')
        }
      },
      // Adding this loader in case I decide to use FontAwesome.
      // Or just fonts.
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/',    // where the fonts will go
            //publicPath: '../'       // override the default path
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/[name].css",
    }),
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      DEFAULT_LANG: "'" + defaultLanguage + "'"
    })
  ],
  devServer: {
    contentBase: contentBase,
    publicPath: '/',
    port: 8081
  },
  devtool: (process.env.NODE_ENV === 'production') ? false : 'source-map'
};

// Add the main index page here:
config.plugins.push(
  new HtmlPlugin({
    template: './src/pages/index.hbs',
    filename: 'index.html',
    minify: (process.env.NODE_ENV === 'production') ? minifyOptions : false,
    chunks: [{
      name: 'languageDetection',
      inject: 'head',
      inline: true
    }, {
      name: 'app',
      inject: 'body',
      inline: false
    }],
    lang: defaultLanguage,
    page: 'index'
  })
);

// Add the different pages.
// I could scan the "pages" directory.
languages.map(l => {
  config.plugins.push(
    new HtmlPlugin(hwpConf(l, 'index'))
  );
});

module.exports = config;