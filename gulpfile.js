'use strict';
var gulp       = require('gulp');
var requireDir = require('require-dir');
var tasks      = requireDir('./gulp/tasks', {recurse: true}); // eslint-disable-line

// include paths file
var paths      = require('./gulp/paths');

// 'gulp inject' -- injects CSS and JS into temporary source directory
gulp.task('inject', gulp.series('inject:css', 'inject:scripts'));

// 'gulp generate' -- copies original source to a temporary source (ignores assets),
// injects styles and scripts into this temporary source, generates site and outputs it
// to temporary build directory, copies generated site from temporary build directory
// to the actual build directory.
gulp.task('generate', gulp.series('copy:tmp', 'inject', 'site', 'copy:site'));

// 'gulp assets' -- builds CSS, JS, creates SVG sprite, copies fonts, optimizes
// images, and copies assets folder to the actual build folder
// 'gulp assets --prod' -- same as above but with production settings
gulp.task('assets', gulp.series(
  gulp.series('scripts', 'styles', 'fonts', 'icons'),
  gulp.series('scripts:gzip', 'styles:gzip', 'images:lazyload', 'images:feature', 'copy:assets')
));

// 'gulp clean' -- removes temporary and built CSS/JS assets, deletes built site,
// removes temporary source. NOTE: Does not delete images from built site to reduce
// the build time due to image optimizations.
gulp.task('clean', gulp.parallel('clean:assets', 'clean:site', 'clean:tmp'));

// 'gulp wipe' -- WARNING: removes all assets, images, and built site,
// Only use if you want to regenerate everything afterwards.
gulp.task('wipe', gulp.series('clean', 'clean:images'));

// 'gulp build' -- same as 'gulp' but doesn't serve site
// 'gulp build --prod' -- same as above but with production settings
gulp.task('build', gulp.series('clean', 'assets', 'generate', 'html:gzip', 'xml:gzip'));

// 'gulp check' -- checks site for errors
gulp.task('check', gulp.series('site:check'));

// 'gulp deploy' -- deploy the site to AWS
gulp.task('deploy', gulp.series('upload:s3'));

// 'gulp' -- removes assets and gzipped files, creates assets and injects
// them, builds site, serves site
// 'gulp --prod' -- same as above but with production settings
gulp.task('default', gulp.series('build', 'serve'));
