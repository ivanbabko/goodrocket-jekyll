'use strict';
var gulp  = require('gulp');

// include paths file
var paths = require('../paths');

// 'gulp copy:assets' -- copies whole assets directory from temporary 
// directory to directory with built Jekyll site
gulp.task('copy:assets', () =>
  gulp.src(paths.assetFilesTemp + '/**/*')
    .pipe(gulp.dest(paths.assetFilesSite))
);

// 'gulp copy:site' -- copies processed Jekyll site from temporary build 
// directory to an actual build directory
gulp.task('copy:site', () =>
  gulp.src([paths.tempDir + paths.siteFolderName + '/**/*', paths.tempDir + paths.siteFolderName + '/**/.*'])
    .pipe(gulp.dest(paths.siteFolderName))
);