var gulp = require('gulp');
var sass = require('gulp-sass');
var path    = require('path');

gulp.task('sass', function () {
  return gulp.src('./assets/css/**/*.sass')
    .pipe(sass({includePaths:[path.join(__dirname, 'node_modules')]}).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./assets/sass/**/*.sass', ['sass']);
});