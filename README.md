# Attempt at Web Design - Case Study #0
Live at https://www.lamusiquedelagarde.be

The project was originally supposed to be a Hugo theme generated through Webpack.

It ended up being the whole site generated through Webpack because that was faster to do than learning about Hugo templating and configure everything over there.

However, just using Webpack would probably be unpractical and take too much time if I had a lot of pages on the site (I'm thinking if there was a blog section).

About that, be patient if you run the dev server or build the site on a slow computer.

## Installing
This project requires NodeJS 8+.

To install, clone the repo and run:
```
npm install
```
Inside the project directory.

## Configuration
Some options, including the absolute base URL for the website (used in the generation of meta tags, among other things) are set in config-options.js at the root of the project.

Also, app.js needs the "old" website URL to redirect in case of unsupported browser. 
It could be a relative URL to some sort of "Unsupported browser" page. In my case it forwards to a static version of the "old" Drupal website.

All the translations are either in locales.json or partials/blocks.

## Dev server
Just run:
```
npm run dev
```
Access the website on http://localhost:8081

If you see errors, maybe a Webpack dependency now depends on something new or different that you need to install manually through npm.

## Generating the site
**About the site path**: The site and some of its components (for instance the language picker) expect its path to start at '/'. Which means you should host the site at something like:

  https://hostname.tld/

And **NOT**:

  https://hostname.tld/some-directory/

Now to generate the website all minified:
```
npm run prod
```

Will populate the "dist" folder with the website files.

## Note about the backend
The contact form depends on a weird backend form that I use because I'm against serverless services for religious reasons.

## Code Style
* Tab -> 2 spaces
* Semicolons
* Use ES6 for Webpack config, imports, Handlebars helpers
* Use ES5 for all the rest
* Use CamelCase except for attribute names and CSS classes

I made the translateBlock.js Handlebars helper so that I would not have HTML inside locales.json. It's a weird requirement I made up in my head for some reason, don't judge me.

## TODO
- [x] A height smaller than 632px should have the same media query as the small or medium screens.
- [x] Add text shadow to the headline.
- [x] Add animations for the stuff in the hero for the index page.
- [x] Add a hash to the dist CSS filename, it's not doing cache busting right now.
- [x] Test the font sizes with the responsive tool of browsers.
- [ ] The shadow on the image-bg-overlay should be inward, not outward.
- [ ] Why am I using bootstrap?
- [x] My contact form backend thingy has to be behind HTTPS or it won't work. 
- [x] Add browser check for flex support, redirect to old site otherwise.
- [x] Check if the bootstrap JS from npm is using ES6, because if it is, I might as well add Babel.
- [x] Add a parameter to add a prefix to page titles, something like "Contact | ", only if that parameter is present.
- [x] Add all the webroot stuff, mostly the favicons
- [ ] Add a sitemap.
- [ ] Put the options that are in app.js in config-options.js.
- [x] Add OpenGraph tags.
- [x] Test the OpenGraph tags.
- [x] Add the alternatives meta tags relative to the two language versions.
- ~~[ ] Stick the footer to bottom. I think that can be done with flex, check how I did it on my website.~~
- [x] Add FontAwesome, I think I can just import the SCSS.
- [x] Now that I got FontAwesome I might as well use icons in... Places.
- [x] Generate a static version of the "old site" to use as the actual old site so we can ditch Drupal.
- [ ] Does the CSS processor really add the prefixes like "-webkit-" to keyframes, for instance?

### About FontAwesome
Bootstrap doesn't have a spinner so I also included the font awesome SCSS because I need it at least for the spinner...

### Open Graph
I vaguely need these tags:
```
<meta property="og:title" content="Dynamic page title">
<meta property="og:site_name" content="La Musique de la Garde Impériale de Waterloo">
<meta property="og:url" content="http://localhost:8081">
<meta property="og:description" content="Description will require translation">
<meta property="og:type" content="website">
<meta property="og:image" content="http://localhost:8081/">
```
Some of which have to change with the language, so I'm going to create a partial.

## Templating
**NB**: I now regret picking handlebars because you have to write helpers for pretty much anything with that template engine, and since I'm only using it on the Node side I don't care that it's very light. Oh well.

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

### Pass information to tempaltes
To give information such as language to a template, this explains how to do it I think: https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates

I need to pass the language to templates to decide on what to display.

The parameters have to get passed to the partials or it won't work.

### Helpers with Webpack
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

### Index page
For SEO reasons, I think my index page should be the full "default language" page (so with app.js as well) but with an additional JS file in head which will do the redirect according to language and the modernizr redirect.

That way if a search engine doesn't apply the redirect it's still getting the whole page.

Another way to do this is to propose a modal dialog asking if the user wants to go to its browser language. The issue is that we will ask everytime unless we use localStorage or a cookie to store the thing.

LocalStorage falls under the same cookie-disclaimer laws though. I will start with a simple "redirect to english if browser is in english" way, then people can use the language selector on site.

This is how the current Drupal site does it anyway, and I'm pretty sure it's got cookies and we don't disclaim anything.

It might be good to have a page explaining the site doesn't use cookies. The so called "privacy statement".

## Page titles
I copied the style in the index hero to use as page title like so:
```
  <div class="text-center mb-5">
    <h1 class="page-title">Historique</h1>
  </div>
```

## Icons etc.
I generated the icons with the realfavicongenerator website.

They gave me that code to use:
```
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#2b5797">
<meta name="theme-color" content="#ffffff">
```

I've put the package content in my webroot directory.

## Old stuff
**DON'T READ THIS**

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
