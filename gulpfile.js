// https://github.com/unlight/gulp-cssimport
var gulp = require('gulp');
var babel = require('gulp-babel');
var cssimport = require('gulp-cssimport');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var gulpMerge = require('gulp-merge');

var polyfill = './node_modules/@babel/polyfill/browser.js';

var globalConfig = {
  src: 'css' // your dev stylesheet directory. No trailing slash
};

// Process CSS
gulp.task('styles', function() {
  return gulp
    .src(globalConfig.src + '/theme.scss.liquid')
    .pipe(plumber())
    .pipe(cssimport())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('style.css.liquid'))
    .pipe(replace('"{{', '{{'))
    .pipe(replace('}}"', '}}'))
    .pipe(gulp.dest('assets/'));
});

// Minify, concatenate, rename, place
// concat.js is a temporary file that Gulp converts into scripts.min.js
gulp.task('javascript', function() {
  return gulpMerge(
    gulp.src('js/vendor.js'),
    gulp.src('js/plugins/*.js'),
    gulp.src(polyfill),
    gulp
      .src('js/theme.js')
      .pipe(plumber())
      .pipe(babel())
  )
    .pipe(concat('concat.js'))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('assets/'));
});

// Watch files
gulp.task('watch', function() {
  gulp.watch(globalConfig.src + '/**/*.*', ['styles']);
  gulp.watch(['js/*.js', '!js/*.min.js'], ['javascript']);
});

// Default task
gulp.task('default', ['watch']);
