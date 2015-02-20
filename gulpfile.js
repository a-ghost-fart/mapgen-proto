var gulp = require('gulp');
var sass = require('gulp-sass');
var bump = require('gulp-bump');
var babelify = require('babelify');
var browserify = require('browserify');
var fs = require('fs');

gulp.task('copy:assets', function () {
    'use strict';
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy:html', function () {
    'use strict';
    return gulp.src('./src/html/**/*.html')
        .pipe(gulp.dest('./dist'));
});


gulp.task('bump:patch', function () {
    'use strict';
    return gulp.src('./package.json')
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('build:js', ['bump:patch'], function () {
    'use strict';
    return browserify()
        .transform(babelify)
        .require('./src/js/app.js', { 'entry': true })
        .bundle()
        .on('error', function (error) {
            console.log('Error : ' + error.message);
        })
        .pipe(fs.createWriteStream('./dist/js/bundled.js'));
});

gulp.task('build:sass', function () {
    'use strict';
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', ['build:js', 'build:sass', 'copy:assets', 'copy:html']);

gulp.task('default', function () {
    'use strict';
    return gulp.watch('./src/**/*', ['build']);
});
