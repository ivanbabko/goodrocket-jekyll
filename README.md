# Goodrocket-Jekyll

Web development boilerplate based on Jekyll and Gulp. Takes care of the mundane, so you can focus on solving user problems. 

## Features

- Generate your site using file-based CMS [Jekyll](https://github.com/jekyll/jekyll) 
(so no databases and stuff). This includes automated Atom feed and sitemap generation.
- Build `style.css` (preprocess SCSS, glob partials, create source maps, add vendor prefixes, 
  group media queries, minify, hash, and gzip).
- Build `script.js` (concatenate, create source maps, minify, hash, and gzip)
- Optimize images using lossless algorythm to reduce file size.
- Optimize and resize `feature` images (i.e. big heavy graphics and photos) to specified widths.
- Optimize, combine, and inline the SVG icon set.
- Minify, hash, and gzip built HTML files.
- Locally serve site with Browser Sync which will instantly reload connected browsers on source 
  files change.
- Deploy site to production via Amazon S3.
- Submit XML sitemap to Google so their bots have a nudge to crawl your site.

## Coming soon
- *Base for your living styleguide / component library.*
- *Stylelint and UnCSS integrated into the build process.* 

## Project structure

If you'd like to modify default structure, edit paths in `gulpfile.js` and `_config.yml`.

```bash
├── gulp                    # => gulp tasks for building the entire site
├── build                   # => built site and assets
├── source                  # => source Jekyll files and assets
|  ├── _data                # => JSON, XML, YML, or CSV data
|  ├── _drafts              # => Draft content (not processed in production)
|  ├── _includes            # => Components and partials written in Liquid/HTML
|  ├── _layouts             # => Page templates written in Liquid/HTML
|  ├── _pages               # => Static pages like home, 404, etc.
|  ├── _posts               # => Content in markdown format (post, articles, etc.)
|  └── assets               # => Static assets
|  |  ├── icons             # => Separate SVG files that will be sprited and inlined
|  |  ├── img               # => Image files
|  |  |   ├── feature       # => Big images that will be resized by Gulp task
|  |  ├── js                
|  |  |   ├── components    # => Our Javascript code
|  |  |   ├── plugins       # => jQuery plugins and 3rd party code snippets
|  |  |   ├── vendor        # => Vendor libraries like jQuery, Modernizr, etc.
|  |  └── css
|  |      ├── ...
|  |      └── style.scss    # => CSS manifest file with all @imports
|  └── robots.txt           # => Make bots behave
├── .editorconfig           # => Config to help our IDEs apply consistent editing rules
├── .gitignore              # => Common Git ignore patterns are included by default
├── _config.dev.yml         # => Jekyll config overrides for local development
├── _config.yml             # => Main Jekyll configuration file
├── Gemfile                 # => Ruby dependencies list for Bundler
├── gulpfile.js             # => Main Gulp tasks
├── package.json            # => Node dependencies list for NPM
├── aws-credentials.json    # => Credentials for deploying to Amazon S3
└── setup                   # => Handy shell script to install dependencies on Mac OS
```

## Dependencies:

- **Ruby**: >2.0 with Bundler >1.10
- **Node**: >4.2 with NPM >3.10
- **Jekyll**: >3.3.1
- **Gulp**: >4.0. Note: If you are currently on pre-4.0 version, refer to 
  [this article](https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html) for 
  installation instructions.
- **GraphicsMagick**. We'll need it to automate image resizing.

### Jekyll Plugins Used

* [Jekyll Sitemap](https://github.com/jekyll/jekyll-sitemap)
* [Jekyll Seo Tag](https://github.com/jekyll/jekyll-seo-tag)
* [Jekyll Feed](https://github.com/jekyll/jekyll-feed)

## Setup

1. **Step 1:** Clone or download this repo and open it in your command line tool of choice.

2. **Step 2:** Install [Bundler](http://bundler.io/) and run `bundle install`.

3. **Step 3:** Install [Node.js](https://nodejs.org/en/) and run `npm install`.

4. **Step 4:** Install **GraphicsMagick**. On Mac OS, use Homebrew `brew install graphicsmagick`. 
   On Windows, [Download](http://www.graphicsmagick.org/download.html/) and Install, be sure that 
   "Update executable search path" is checked during installation. On Ubuntu, do 
   `apt-get install graphicsmagick`.

5. **Step 5:** Run `gulp` and open `http://localhost:4000` in your browser to be served.

**NOTE**: If you're on Mac OS, I recommend using included shell script that automates 
the steps outlined above. Just type `./setup` in your Terminal app.

## Usage

Below you'll find main Gulp commands. They are based on multiple subtasks which 
live in their own files in the gulp folder. They are named after what they do
and are commented, so it should be easy to customize them. 

#### `gulp [--prod]`

This is the default command, and probably the one you'll use the most. It builds 
your assets and site with development settings. You'll get sourcemaps, your drafts
will be generated. As you are changing your posts, pages and assets they will 
automatically update and inject into your browser via BrowserSync.

> `gulp --prod`

Once you are done and want to verify that everything works with production
settings you add the flag `--prod` and your assets will be optimized. Your CSS,
JS and HTML will be minified and gzipped, plus the CSS and JS will be cache
busted. The images will be compressed and Jekyll will generate a site with all
your posts and no drafts.

#### `gulp build [--prod]`

This command is identical to the normal `gulp [--prod]` however it will not
create a BrowserSync session in your browser.

#### `gulp deploy`

When you're done developing and have built your site with either `gulp --prod`
or `gulp build --prod` you can deploy your site to Amazon S3. Don't forget to configure 
aws-credentials.json.

#### `gulp clean`

Deletes your assets from their `.tmp` directory as well as in `build`. **NOTE:** Does 
not delete images from `.tmp` to reduce the time to build the site due to image optimizations.

#### `gulp wipe`

This will delete everything from `.tmp` directory as well as in `build` (images, assets, generated Jekyll site). 

## Frequently Asked Questions

**So why Goodrocket?** 
Because a good rocket will take you really far really fast. And it won't explode in the process. 
I thought this was a good metaphor for a reliable web development boilerplate that focuses on performance 
for the user and for you as a developer.

**Why another boilerplate?**
Two reasons. First, I wanted to learn how Gulp works. Second, I find it hard to use other people's 
boilerplates "as is". I have to understand fully what is under the hood to trust the system, and when 
I figure things out, I start disagreeing and customizing. So I figured I'll just create my own 
opinionated starting kit and find peace.

---

### Credits

- **[generator-jekyllized](https://github.com/sondr3/generator-jekyllized)** by [Sondre Nilsen](https://github.com/sondr3).
- **[made-mistakes-jekyll](https://github.com/mmistakes/made-mistakes-jekyll)** by [Michael Rose](https://github.com/mmistakes).
- **[jekyll-boilerplate](https://github.com/HugoGiraudel/jekyll-boilerplate)** by [Hugo Giraudel](https://github.com/HugoGiraudel).
