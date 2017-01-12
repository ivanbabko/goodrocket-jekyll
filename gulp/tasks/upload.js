'use strict';
var fs           = require('fs');
var gulp         = require('gulp');
var awspublish   = require('gulp-awspublish');
var parallelize  = require('concurrent-transform');

// include paths file
var paths = require('../paths');

// 'gulp upload:s3' -- reads AWS credentials file, creates the correct headers 
// for our files and uploads them to S3
gulp.task('upload:s3', () => {
  var credentials = JSON.parse(fs.readFileSync('aws-credentials.json', 'utf8'));
  var publisher = awspublish.create(credentials);
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src(paths.siteFolderName + '/**/*', {dot: true})
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers), 30))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});

// 'gulp submit:sitemap` -- submit sitemap XML file to Google and Bing
gulp.task('submit:sitemap', function(cb) {
  var SitemapUrl = paths.prodUrl + '/sitemap.xml';
  require('submit-sitemap').submitSitemap(SitemapUrl, function(err) {
    if (err)
      console.warn(err);
    cb();
  });
});