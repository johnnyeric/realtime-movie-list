'use strict';
//https://moroccojs.org/tutorials/npm-based-front-end-workflow/

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var path    = require('path');
var source = require('vinyl-source-stream');
var assign = require('lodash.assign');

gulp.task('sass', function () {
  return gulp.src('./assets/sass/**/*.sass')
    .pipe(sass({includePaths:[path.join(__dirname, 'node_modules')]}).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./assets/sass/**/*.sass', ['sass']);
});

/* Browserify
// add custom browserify options here
var customOpts = {
  entries: ['./assets/js/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents --
    //.pipe(buffer()) --> var buffer = require('vinyl-buffer');
    .pipe(gulp.dest('./public/js'));
}
*/