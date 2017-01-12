'use strict';
var fs           = require('fs');
var gulp         = require('gulp');
var rsync        = require('gulp-rsync');
var awspublish   = require('gulp-awspublish');
var parallelize  = require('concurrent-transform');

// include paths file
var paths = require('../paths');

// 'gulp upload:rsync' -- reads rsync credentials file and 
// incrementally uploads site to server
gulp.task('upload:rsync', () => {
  var credentials = JSON.parse(fs.readFileSync('rsync-credentials.json', 'utf8'));
  return gulp.src(paths.siteFolderName)
    .pipe(rsync({
      // dryrun: true
      root: paths.siteDir,
      hostname: credentials.hostname,
      username: credentials.username,
      destination: credentials.destination,
      incremental: true,
      recursive: true,
      compress: true,
      clean: false,
      chmod: 'Du=rwx,Dgo=rx,Fu=rw,Fgo=r'
    }));
});

// 'gulp upload:s3' -- reads AWS credentials file, creates the correct headers 
// for our files and uploads them to S3
gulp.task('upload:s3', () => {
  var credentials = JSON.parse(fs.readFileSync('aws-credentials.json', 'utf8'));
  var publisher = awspublish.create(credentials);
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('dist/**/*', {dot: true})
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