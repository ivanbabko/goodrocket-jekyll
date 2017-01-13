'use strict';
var argv  = require('yargs').argv;
var gulp  = require('gulp');
var shell = require('shelljs');

// include paths file
var paths = require('../paths');

// 'gulp site' -- builds site with development settings
// 'gulp site --prod' -- builds site with production settings
gulp.task('site', done => {
  if (!argv.prod) {
    shell.exec('bundle exec jekyll build --incremental --config _config.yml,_config.dev.yml');
    done();
  } else if (argv.prod) {
    shell.exec('bundle exec jekyll build');
    done();
  }
});

// 'gulp site:check' -- runs Jekyll doctor
gulp.task('site:check', done => {
  shell.exec('bundle exec jekyll doctor');
  done();
});