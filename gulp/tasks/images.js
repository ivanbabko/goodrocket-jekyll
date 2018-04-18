'use strict';
var changed     = require('gulp-changed');
var filter      = require('gulp-filter');
var glob        = require('glob');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var newer       = require('gulp-newer');
var notify      = require('gulp-notify');
var rename      = require('gulp-rename');
var responsive  = require('gulp-responsive');
var size        = require('gulp-size');
var util        = require('gulp-util');
var imagemin    = require('gulp-imagemin');

// include paths file
var paths       = require('../paths');

// 'gulp images:optimize' -- optimize images
gulp.task('images:optimize', () => {
  return gulp.src([paths.imageFilesGlob, '!' + paths.imageFiles + '/{resize,resize/**}']) // exclude images that will be handled by 'images:resize' task
    .pipe(newer(paths.imageFilesSite))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng(),
      imagemin.svgo({plugins: [{cleanupIDs: false}]})
    ], {verbose: true}))
    .pipe(gulp.dest(paths.imageFilesSite))
    .pipe(size({title: 'images'}))
});

// 'gulp images:resize' -- resize images
gulp.task('images:resize', () => {
  return gulp.src([paths.imageFiles + '/resize' + paths.imagePattern, '!' + paths.imageFiles + '/resize/**/*.{gif,svg}'])
    .pipe(changed(paths.imageFilesSite))
    .pipe(responsive({
      // resize all images
      '*.*': [{
        width: 20,
        rename: { suffix: '-lq' },
      }, {
        width: 640,
        rename: { suffix: '-s' },
      }, {
        width: 1024,
        rename: { suffix: '-m' },
      }, {
        width: 1280,
        rename: { suffix: '-l' },
      }, {
        width: 1920,
        rename: { suffix: '-xl' },
      }, {
        // copy original image
        width: '100%',
        rename: { suffix: '' },
      }]
    }, {
      // global configuration for all images
      errorOnEnlargement: false,
      withMetadata: false,
      errorOnUnusedConfig: false
    }))
    .pipe(gulp.dest(paths.imageFilesSite))
});
