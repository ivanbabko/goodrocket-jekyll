'use strict';
var argv         = require('yargs').argv;
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync').create();
var cheerio      = require('gulp-cheerio');
var concat       = require('gulp-concat');
var cssnano      = require('gulp-cssnano');
var gulp         = require('gulp');
var gzip         = require('gulp-gzip');
var newer        = require('gulp-newer');
var postcss      = require('gulp-postcss');
var gcmq         = require('gulp-group-css-media-queries');
var rename       = require('gulp-rename');
var rev          = require('gulp-rev');
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var size         = require('gulp-size');
var svgstore     = require('gulp-svgstore');
var svgmin       = require('gulp-svgmin');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var when         = require('gulp-if');
var uncss        = require('gulp-uncss');

// include paths file
var paths        = require('../paths');

// 'gulp scripts' -- creates a script.js file with Sourcemap from our JavaScript files.
// 'gulp scripts --prod' -- creates a script.js file from our JavaScript files,
// minifies, and cache busts it. Does not create a Sourcemap
gulp.task('scripts', () =>
  // NOTE: The order here is important since it's concatenated in order from
  // top to bottom, so you want vendor scripts etc on top
  gulp.src([
    paths.jsFiles + '/vendor/**/*.js',
    paths.jsFiles + '/plugins/**/*.js',
    paths.jsFiles + '/components/**/*.js'
  ])
    .pipe(newer(paths.jsFilesTemp + '/script.js', {dest: paths.jsFilesTemp, ext: '.js'}))
    .pipe(when(!argv.prod, sourcemaps.init()))

     // Concatenate scripts
    .pipe(concat('script.js'))
    .pipe(size({showFiles: true}))

    // Minify JS for production
    .pipe(when(argv.prod, when('*.js', uglify({preserveComments: 'some'}))))
    .pipe(when(argv.prod, size({showFiles: true})))

    // Output sourcemap for development
    .pipe(when(!argv.prod, sourcemaps.write('.')))
    .pipe(when(!argv.prod, gulp.dest(paths.jsFilesTemp)))

    // Hash JS for production
    .pipe(when(argv.prod, rev()))

    // Output hashed files
    .pipe(when(argv.prod, gulp.dest(paths.jsFilesTemp)))
);


// 'gulp scripts:gzip --prod' -- gzips JS
gulp.task('scripts:gzip', () => {
  return gulp.src([paths.jsFilesTemp + '/*.js'])
  .pipe(when(argv.prod, when('*.js', gzip({append: true}))))
    .pipe(when(argv.prod, size({
      gzip: true,
      showFiles: true
    })))
    .pipe(when(argv.prod, gulp.dest(paths.jsFilesTemp)))
});



// 'gulp styles' -- creates a style.css file from partials imported in style.scss,
// groups media queries, adds prefixes, and creates a Sourcemap.
// 'gulp styles --prod' -- creates a style.css file from partials imported in
// style.scss, groups media queries, adds prefixes, minifies and casche busts, but
// does not create a Sourcemap.
gulp.task('styles', () =>
  gulp.src(paths.sassFiles + '/style.scss')
    .pipe(when(!argv.prod, sourcemaps.init()))

    // Glob partials into single file
    .pipe(sassGlob())

    // Preprocess SASS
    .pipe(sass({precision: 10}).on('error', sass.logError))

    // Add vendor prefixes
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 versions', '> 5%', 'IE 9']})
    ]))

    // Group media queries
    .pipe(gcmq())
    .pipe(size({showFiles: true}))

    // Minify CSS for production
    .pipe(when(argv.prod, when('*.css', cssnano({autoprefixer: false}))))
    .pipe(when(argv.prod, size({showFiles: true})))

    // Output sourcemap for development
    .pipe(when(!argv.prod, sourcemaps.write('.')))

    // Hash CSS for production
    .pipe(when(argv.prod, rev()))
    .pipe(when(argv.prod, size({showFiles: true})))

    // Output hashed files
    .pipe(gulp.dest(paths.sassFilesTemp))

    .pipe(when(!argv.prod, browserSync.stream()))
);


// 'gulp styles:uncss' -- removes unused CSS
gulp.task('styles:uncss', () => {
  return gulp.src([paths.sassFilesTemp + '/*.css'])
      .pipe(uncss({
          html: ['build/**/*.html'],
          ignore: [
            new RegExp('^meta\..*'),
            new RegExp('^\.is-.*')
          ]
       }))
      .pipe(gulp.dest(paths.sassFilesTemp))
});


// 'gulp styles:gzip --prod' -- gzips CSS
gulp.task('styles:gzip', () => {
  return gulp.src([paths.sassFilesTemp + '/*.css'])
    .pipe(when(argv.prod, when('*.css', gzip({append: true}))))
      .pipe(when(argv.prod, size({
        gzip: true,
        showFiles: true
      })))
      .pipe(when(argv.prod, gulp.dest(paths.sassFilesTemp)))
});


// 'gulp icons' -- minifies SVG files, adds 'icon-' prefix to each file name,
// combines all SVG files into icons.svg, there it generates symbols
// <symbol id="filename">, removes the inline fill attribute, copies the SVG
// sprite from source to temporary assets directory
gulp.task('icons', function() {
  return gulp.src(paths.iconFiles + '/**/*.svg')
    .pipe(svgmin())
    //.pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore({fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
       $('svg').attr('style', 'display:none');
       $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(paths.sourceDir + paths.includesFolderName));
});


// 'gulp fonts' -- copies fonts from source directory to temporary assets directory
gulp.task('fonts', () =>
  gulp.src(paths.fontFiles + '/**/*')
    .pipe(gulp.dest(paths.fontFilesTemp))
    .pipe(size({title: 'fonts'}))
);


// function to properly reload the browser
function reload(done) {
  browserSync.reload();
  done();
}


// 'gulp serve' -- open site in browser and watch for changes in source files
// and update them when needed
gulp.task('serve', (done) => {
  browserSync.init({
    // tunnel: true,
    open: false,
    port: 4000, // change port to match default Jekyll
    ui: {
      port: 4001
    },
    server: [paths.tempFolderName, paths.siteFolderName]
  });
  done();
  // watch various files for changes, run necessary tasks, and reload the browser
  gulp.watch([paths.mdFilesGlob, paths.htmlFilesGlob, paths.ymlFilesGlob, paths.xmlFilesGlob], gulp.series('clean:tmp', 'generate', reload));
  gulp.watch([paths.txtFilesGlob], gulp.series('site', reload));
  gulp.watch(paths.jsFilesGlob, gulp.series('scripts', reload));
  gulp.watch(paths.sassFilesGlob, gulp.series('styles', reload));
  gulp.watch(paths.iconFilesGlob, gulp.series('icons', 'generate', reload));
  gulp.watch(paths.imageFilesGlob, gulp.series('images:optimize', 'images:resize', reload));
});
