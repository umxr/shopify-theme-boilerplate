// https://github.com/unlight/gulp-cssimport
const gulp = require('gulp');
const babel = require('gulp-babel');
const cssimport = require('gulp-cssimport');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const gulpMerge = require('gulp-merge');

const polyfill = './node_modules/@babel/polyfill/browser.js';

const globalConfig = {
  src: 'css', // your dev stylesheet directory. No trailing slash
};

// Process CSS
gulp.task('styles', function() {
  return gulp
    .src(`${globalConfig.src}/theme.scss.liquid`)
    .pipe(plumber())
    .pipe(cssimport())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
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
  gulp.watch(`${globalConfig.src}/**/*.*`, ['styles']);
  gulp.watch(['js/*.js', '!js/*.min.js'], ['javascript']);
});

// Default task
gulp.task('default', ['watch']);
