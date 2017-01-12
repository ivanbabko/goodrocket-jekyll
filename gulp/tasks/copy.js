'use strict';
var gulp  = require('gulp');
var size  = require('gulp-size');

// include paths file
var paths = require('../paths');

// 'gulp copy:tmp' -- copies source of the site to a temporary directory 
// to be processed. Does not copy assets folder as it will be processed 
// separately by other gulp tasks and not by our generator.
gulp.task('copy:tmp', () =>
  gulp.src([paths.sourceFolderName + '/**/*', '!' + paths.sourceDir + paths.assetsFolderName + '/**/*', '!' + paths.sourceDir + paths.assetsFolderName], {dot: true})
    .pipe(gulp.dest(paths.tempDir + paths.sourceFolderName))
    .pipe(size({title: 'Jekyll'}))
);

// 'gulp copy:assets' -- copies assets from temporary directory 
// to directory with built site
gulp.task('copy:assets', () =>
  gulp.src(paths.assetFilesTemp + '/**/*')
    .pipe(gulp.dest(paths.assetFilesSite))
);

// 'gulp copy:site' -- copies processed site from temporary build 
// directory to an actual build directory
gulp.task('copy:site', () =>
  gulp.src([paths.tempDir + paths.siteFolderName + '/**/*', paths.tempDir + paths.siteFolderName + '/**/.*'])
    .pipe(gulp.dest(paths.siteFolderName))
);