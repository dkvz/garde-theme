// Stole a good part of this config from there:
// https://github.com/jalkoby/sass-webpack-plugin
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const contentBase = path.join(__dirname, 'dist');

// Is your plan to never, ever split this config file into 
// multiple files ?
// Yes. That is my plan. Thanks for asking.

// Supported languages:
const languages = ['fr', 'en'];
// The main index page will be generated using the
// default language.
const defaultLanguage = 'fr';
// This is passed to the templates and used in some metatags:
// (NO TRAILING SLASH Plz Sorry For CaPS)
const absoluteUrl = 'https://2018.lamusiquedelagarde.be';

// Generates config objects for HtmlWebpackPlugin instances:
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: false
}
function hwpConf(lang, page, pageTitle) {
  return {
    template: './src/pages/' + page + '.hbs',
    filename: lang + '/' + page + '.html',
    minify: (process.env.NODE_ENV === 'production') ? minifyOptions : false,
    chunks: ['app'],
    lang: lang,
    page: page,
    absoluteUrl: absoluteUrl,
    pageTitle: pageTitle ? pageTitle : undefined
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
        test: /\.pdf$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: 'static/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
            helperDirs: path.join(__dirname, 'src/helpers'),
            partialDirs: path.join(__dirname, 'src/partials'),
            inlineRequires: '/static/'
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
    new CopyWebpackPlugin([
      {from: 'webroot', to: ''}
    ]),
    new webpack.DefinePlugin({
      DEFAULT_LANG: "'" + defaultLanguage + "'"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  devServer: {
    contentBase: contentBase,
    publicPath: '/',
    port: 8081
  },
  devtool: (process.env.NODE_ENV === 'production') ? false : 'source-map'
};

// Since we're generating a static site with Webpack
// We now have to add a whole bunch of instances of
// HtmlWebpackPlugin. Pure elegance.

// Add the main index page here:
config.plugins.push(
  new HtmlPlugin({
    template: './src/pages/index.hbs',
    filename: 'index.html',
    minify: (process.env.NODE_ENV === 'production') ? minifyOptions : false,
    /* I have to use this whole mess because HtmlWebpackPlugin
     either injects everything in head, or everything in body.
     And I wanted one of each.
     So we're disabling injection and using an ugly helper in the template.
    */
    inject: false,
    chunks: ['languageDetection', 'app'],
    headScript: 'languageDetection',
    bodyScript: 'app',
    lang: defaultLanguage,
    page: 'index',
    absoluteUrl: absoluteUrl
  })
);

// Add the different pages.
// I could scan the "pages" directory.
languages.map(l => {
  config.plugins.push(
    new HtmlPlugin(hwpConf(l, 'index')),
    new HtmlPlugin(hwpConf(l, 'contact', 'contactUsTitle')),
    new HtmlPlugin(hwpConf(l, 'historique', 'history')),
    new HtmlPlugin(hwpConf(l, 'localisation', 'addressAndSched')),
    new HtmlPlugin(hwpConf(l, 'cd', 'audioCd')),
    new HtmlPlugin(hwpConf(l, 'presse', 'press'))
  );
});

module.exports = config;