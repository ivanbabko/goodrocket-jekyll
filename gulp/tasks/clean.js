'use strict';
var del   = require('del');
var gulp  = require('gulp');

// include paths file
var paths = require('../paths');

// 'gulp clean:assets' -- removes temporary and built CSS/JS assets but keeps images
gulp.task('clean:assets', () => {
  return del([paths.assetFilesTemp + '/**/*', '!' + paths.assetFilesTemp, paths.assetFilesSite + '/**/*', '!' + paths.imageFilesSite, '!' + paths.imageFilesSite + '/**/*']);
});

// 'gulp clean:images' -- removes only image assets from built site
gulp.task('clean:images', () => {
  return del([paths.imageFilesSite]);
});

// 'gulp clean:site' -- removes built site but keeps images
gulp.task('clean:site', () => {
  return del([paths.siteFolderName + '/**/*', '!' + paths.assetFilesSite, '!' + paths.imageFilesSite, '!' + paths.imageFilesSite + '/**/*'], {'dot': true});
});

// 'gulp clean:gzip' -- removes gzip files from built site
gulp.task('clean:gzip', () => {
  return del([paths.siteFolderName  + '/**/*.gz']);
});

// 'gulp clean:tmp' -- removes temporary source directory
gulp.task('clean:tmp', () => {
  return del([paths.tempDir  + paths.sourceFolderName]);
});