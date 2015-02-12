var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var bump = require('gulp-bump');
var react = require('gulp-react');

var paths = {
    'src': {
        'scss': './src/scss/**/*.scss',
        'js': './src/js/**/*.js',
        'html': './src/html/**/*.html',
        'assets': './src/assets/**/*'
    },
    'dist': {
        'css': './dist/css/',
        'js': './dist/js/',
        'html': './dist/',
        'assets': './dist/assets'

    }
};

gulp.task('copy:assets', function () {
    'use strict';
    return gulp.src(paths.src.assets)
        .pipe(gulp.dest(paths.dist.assets));
});

gulp.task('copy:html', function () {
    'use strict';
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.html));
});

gulp.task('bump', function () {
    'use strict';
    return gulp.src('./package.json')
        .pipe(plumber())
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('build:jsx', function () {
    'use strict';
    return gulp.src('src/jsx/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'));
});

gulp.task('build:js', ['bump'], function () {
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

gulp.task('build', ['build:js', 'build:sass', 'copy:assets', 'copy:html']);

gulp.task('default', function () {
    'use strict';
    return gulp.watch('./src/**/*', ['build']);
});
