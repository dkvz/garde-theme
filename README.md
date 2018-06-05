# Weird attempt at Web Design

# Dev server
```
npm run dev
```

# Code Style
* Tab -> 2 spaces
* Semicolons
* Use ES6 for Webpack config, imports, Handlebars helpers
* Use ES5 for all the rest

# TODO
[ ] The shadow on the image-bg-overlay should be inward, not outward.
[ ] Why am I using bootstrap?
[ ] Try the "display" classes on hero titles. 
[ ] Add browser check for flex support, redirect to old site otherwise.
[ ] Check if the bootstrap JS from npm is using ES6, because if it is, I might as well add Babel.
[ ] Add a parameter to add a prefix to page titles, something like "Contact | ", only if that parameter is present.
[ ] Add all the webroot stuff, mostly the favicon, maybe a sitemap.
[ ] Add FontAwesome, I think I can just import the SCSS.

## About FontAwesome
I've seen this import:
```
$fa-font-path: "~font-awesome/fonts";
@import '~font-awesome/scss/font-awesome.scss';
```
 
# Templating
There is a webpack loader for Handlebar templates:
```
loaders: [
        // Compile handlebars template
        {
            test: /\.hbs$/,
            loader: 'handlebars-loader',
            options: {
                helperDirs: DIR_HELPERS,
                partialDirs: DIR_PARTIALS
            }
        }
    ],
```

Example taken from this repo: https://github.com/gokulthehunter/Webpack-boilerplate/blob/master/scripts/config/pages.config.js

This example also creates a list of instances of HtmlWebpackPlugin for each page by first getting a list of every page using something like:
```
const pages = fs.readdirSync(DIR_PAGES).filter(fileName => REGEX_HBS.test(fileName));
```

## Pass information to tempaltes
To give information such as language to a template, this explains how to do it I think: https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates

I need to pass the language to templates to decide on what to display.

The parameters have to get passed to the partials or it won't work.

## Helpers with Webpack
You can apparently export the function with the correct script filename and it works:
```
module.exports = function (key, short) {
  return 'Asked for a helper';
};
```
Then provided my module file here is named 'translate.js', I can use the function in templates like so:
```
{{{translate test}}}
```

Don't forget to add "helpersDir" to the hbr loader for the resolution to work the easiest.

## Index page
For SEO reasons, I think my index page should be the full "default language" page (so with app.js as well) but with an additional JS file in head which will do the redirect according to language and the modernizr redirect.

That way if a search engine doesn't apply the redirect it's still getting the whole page.

Another way to do this is to propose a modal dialog asking if the user wants to go to its browser language. The issue is that we will ask everytime unless we use localStorage or a cookie to store the thing.

LocalStorage falls under the same cookie-disclaimer laws though. I will start with a simple "redirect to english if browser is in english" way, then people can use the language selector on site.

This is how the current Drupal site does it anyway, and I'm pretty sure it's got cookies and we don't disclaim anything.

It might be good to have a page explaining the site doesn't use cookies. The so called "privacy statement".

# Old stuff

Use this instead:
```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}
```

The normal SASS import doesn't create all the "webkit-" etc prefixes, a config such as this is required (it's in the Bootstrap doc):
```
  ...
  {
    test: /\.(scss)$/,
    use: [{
      loader: 'style-loader', // inject CSS to page
    }, {
      loader: 'css-loader', // translates CSS into CommonJS modules
    }, {
      loader: 'postcss-loader', // Run post css actions
      options: {
        plugins: function () { // post css plugins, can be exported to postcss.config.js
          return [
            require('precss'),
            require('autoprefixer')
          ];
        }
      }
    }, {
      loader: 'sass-loader' // compiles Sass to CSS
    }]
  },
```