'use strict';
var gulp       = require('gulp');
var requireDir = require('require-dir');
var tasks      = requireDir('./gulp/tasks', {recurse: true}); // eslint-disable-line

// include paths file
var paths      = require('./gulp/paths');

// 'gulp inject' -- injects CSS and JS into Jekyll temporary source directory 
gulp.task('inject', gulp.series('inject:css', 'inject:scripts'));

// 'gulp build:site'
//
// 1. Copies original source of the Jekyll site to a temporary source.
//    Ignores assets folder as it will be processed by other task.
// 2. Injects styles and scripts into the temporary source.
// 3. Builds the Jekyll site and outputs it to temporary build directory.
// 4. Copies processed Jekyll site from temporary build directory 
//    to the actual build directory.
gulp.task('build:site', gulp.series('site:tmp', 'inject', 'site', 'copy:site'));

// 'gulp assets' -- builds CSS, JS, creates SVG sprite, copies fonts, optimizes
// images, and copies assets folder to the actual build folder
// 'gulp assets --prod' -- same as above but with production settings
gulp.task('assets', gulp.series(
  gulp.parallel('styles', 'scripts', 'icons', 'fonts'),
  gulp.series('images', 'images:feature', 'copy:assets')
));

// 'gulp clean' -- removes temporary and built CSS/JS assets and deletes 
// any gzipped files. NOTE: Does not delete images to reduce the time 
// to build the site due to image optimizations.
gulp.task('clean', gulp.parallel('clean:assets', 'clean:gzip', 'clean:site', 'clean:tmp'));

// 'gulp build' -- same as 'gulp' but doesn't serve site
// 'gulp build --prod' -- same as above but with production settings
gulp.task('build', gulp.series('clean', 'assets', 'build:site', 'html', 'xml'));

// 'gulp deploy' -- deploy production version of the site to AWS
gulp.task('deploy', gulp.series('upload:s3'));

// 'gulp wipe' -- WARNING: removes all assets, images, and built site,
// Only use if you want to regenerate everything afterwards.
gulp.task('wipe', gulp.series('clean', 'clean:images'));

// 'gulp check' -- checks your Jekyll site for errors
gulp.task('check', gulp.series('site:check'));

// 'gulp' -- removes assets and gzipped files, creates assets and injects
// them into includes or layouts, builds site, serves site
// 'gulp --prod' -- same as above but with production settings
gulp.task('default', gulp.series('build', 'serve'));
