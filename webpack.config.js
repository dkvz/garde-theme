// Stole a part of this config from there:
// https://github.com/jalkoby/sass-webpack-plugin
// I went in complete sucette afterwards though.
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const contentBase = path.join(__dirname, 'dist');

// Is your plan to never, ever split this config file into 
// multiple files?
// Yes. That is my plan. Thanks for asking.

// Actually I did put some options in another file:
const { conf } = require('./config-options.js');

// Instead of having one file for prod and one for dev
// I got this really weird convoluted export that exports
// a function and uh... I'm so sorry.
// PS: I hate Webpack.

// Generates config objects for HtmlWebpackPlugin instances:
const minifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: false
}
function hwpConf(lang, page, pageTitle, env) {
  return {
    template: './src/pages/' + page + '.hbs',
    filename: lang + '/' + page + '.html',
    minify: (env === 'production') ? minifyOptions : false,
    chunks: ['app'],
    lang: lang,
    page: page,
    absoluteUrl: conf.absoluteUrl,
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
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
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
          { loader: "sass-loader" }
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
      { from: 'webroot', to: '' }
    ]),
    new webpack.DefinePlugin({
      DEFAULT_LANG: "'" + conf.defaultLanguage + "'"
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
  }
};

// I have to do this export a function thingy just because
// I need to determine the environment, and NODE_ENV is not
// just unreliable, it's NOT WORKING AT ALL.
module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  // Since we're generating a static site with Webpack
  // We now have to add a whole bunch of instances of
  // HtmlWebpackPlugin. Pure elegance.

  // Add the main index page here:
  config.plugins.push(
    new HtmlPlugin({
      template: './src/pages/index.hbs',
      filename: 'index.html',
      minify: (argv.mode === 'production') ? minifyOptions : false,
      /* I have to use this whole mess because HtmlWebpackPlugin
       either injects everything in head, or everything in body.
       And I wanted one of each.
       So we're disabling injection and using an ugly helper in the template.
      */
      inject: false,
      chunks: ['languageDetection', 'app'],
      headScript: 'languageDetection',
      bodyScript: 'app',
      lang: conf.defaultLanguage,
      page: 'index',
      absoluteUrl: conf.absoluteUrl
    })
  );

  // Add the different pages.
  // I could scan the "pages" directory.
  conf.languages.map(l => {
    config.plugins.push(
      new HtmlPlugin(hwpConf(l, 'index', undefined, argv.mode)),
      new HtmlPlugin(hwpConf(l, 'contact', 'contactUsTitle', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'historique', 'history', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'localisation', 'addressAndSched', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'cd', 'audioCd', argv.mode)),
      new HtmlPlugin(hwpConf(l, 'presse', 'press', argv.mode))
    );
  });

  return config;
};