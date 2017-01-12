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

// include paths file
var paths        = require('../paths');

// 'gulp scripts' -- creates a index.js file with Sourcemap from your JavaScript files
// 'gulp scripts --prod' -- creates a index.js file from your JavaScript files,
// minifies, gzips and cache busts it. Does not create a Sourcemap
gulp.task('scripts', () =>
  // NOTE: The order here is important since it's concatenated in order from
  // top to bottom, so you want vendor scripts etc on top
  gulp.src([
    paths.jsFiles + '/vendor/**/*.js',
    paths.jsFiles + '/plugins/**/*.js',
    paths.jsFiles + '/components/**/*.js'
  ])
    .pipe(newer(paths.jsFilesTemp + '/index.js', {dest: paths.jsFilesTemp, ext: '.js'}))
    .pipe(when(!argv.prod, sourcemaps.init()))
    .pipe(concat('index.js'))
    .pipe(size({
      showFiles: true
    }))
    .pipe(when(argv.prod, rename({suffix: '.min'})))
    .pipe(when(argv.prod, when('*.js', uglify())))
    .pipe(when(argv.prod, size({
      showFiles: true
    })))
    .pipe(when(argv.prod, rev()))
    .pipe(when(!argv.prod, sourcemaps.write('.')))
    .pipe(when(argv.prod, gulp.dest(paths.jsFilesTemp)))
    .pipe(when(argv.prod, when('*.js', gzip({append: true}))))
    .pipe(when(argv.prod, size({
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest(paths.jsFilesTemp))
);

// 'gulp styles' -- creates a index.css file with Sourcemap from your Sass files,
// groups media queries, adds prefixes, and creates a Sourcemap.
// 'gulp styles --prod' -- globs SCSS partials into one CSS file, groups media 
// queries, adds prefixes, gzips and cache busts. Does not create a Sourcemap
gulp.task('styles', () =>
  gulp.src(paths.sassFiles + '/index.scss')
    .pipe(when(!argv.prod, sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass({
      precision: 10
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 versions', '> 5%', 'IE 9']})
    ]))
    .pipe(gcmq())
    .pipe(size({
      showFiles: true
    }))
    .pipe(when(argv.prod, rename({suffix: '.min'})))
    .pipe(when(argv.prod, when('*.css', cssnano({autoprefixer: false}))))
    .pipe(when(argv.prod, size({
      showFiles: true
    })))
    .pipe(when(argv.prod, rev()))
    .pipe(when(!argv.prod, sourcemaps.write('.')))
    .pipe(when(argv.prod, gulp.dest(paths.sassFilesTemp)))
    .pipe(when(argv.prod, when('*.css', gzip({append: true}))))
    .pipe(when(argv.prod, size({
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest(paths.sassFilesTemp))
    .pipe(when(!argv.prod, browserSync.stream()))
);


// 'gulp icons' -- minifies each SVG icon, adds 'icon-' prefix to each, 
// combines all SVGs into one, generates <Symbol> with filename of each 
// SVGs as the id, removes the inline fill attribute, copies the generated 
// single SVG sprite from source to the temporary assets directory
gulp.task('icons', function() {
  return gulp.src(paths.iconFiles + '/**/*.svg')
    .pipe(svgmin())
    //.pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore({fileName: 'icons.svg', inlineSvg: false}))
    .pipe(cheerio({
      run: function ($, file) {
       $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(paths.assetFilesTemp));
});


// 'gulp fonts' -- copies fonts from source directory to temporary assets directory
gulp.task('fonts', () =>
  gulp.src(paths.fontFiles + '/**/*')
    .pipe(gulp.dest(paths.fontFilesTemp))
    .pipe(size({title: 'fonts'}))
);


// function to properly reload your browser
function reload(done) {
  browserSync.reload();
  done();
}


// 'gulp serve' -- open site in browser and watch for changes
// in source files and update them when needed
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
  gulp.watch([paths.mdFilesGlob, paths.htmlFilesGlob, paths.ymlFilesGlob, paths.xmlFilesGlob], gulp.series('clean:tmp', 'build:site', reload));
  gulp.watch([paths.txtFilesGlob], gulp.series('site', reload));
  gulp.watch(paths.jsFilesGlob, gulp.series('scripts', reload));
  gulp.watch(paths.sassFilesGlob, gulp.series('styles'));
  gulp.watch(paths.iconFilesGlob, gulp.series('icons', reload));
  gulp.watch(paths.imageFilesGlob, gulp.series('images', 'images:feature', reload));
});