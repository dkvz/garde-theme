# Weird attempt at Web Design

# Dev server
```
npm run dev
```

# TODO
[ ] The shadow on the image-bg-overlay should be inward, not outward.
[ ] Why am I using bootstrap?
[ ] Try the "display" classes on hero titles. 
[ ] Add browser check for flex support, redirect to old site otherwise.

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