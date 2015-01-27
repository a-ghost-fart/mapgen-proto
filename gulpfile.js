var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

gulp.task('build:js', function () {
    'use strict';
    return gulp.src('src/js/app.js')
        .pipe(plumber())
        .pipe(browserify())
        .pipe(rename('bundled.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('build:sass', function () {
    'use strict';
    return gulp.src('src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

gulp.task('build', ['build:js', 'build:sass']);

gulp.task('default', function () {
    'use strict';
    return gulp.watch('./src/**/*', ['build']);
});
