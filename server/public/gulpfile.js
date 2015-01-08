var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    less: ['./less/**/*.less']
};

// gulp.task('default', ['less']);

// gulp.task('less', function(done) {
//     gulp.src('./less/app.less')
//         .pipe(less())
//         .pipe(gulp.dest('./css/'))
//         .pipe(minifyCss({
//             keepSpecialComments: 0
//         }))
//         .pipe(rename({
//             extname: '.min.css'
//         }))
//         .pipe(gulp.dest('./css/'))
//         .on('end', done);
// });

// gulp.task('watch', function() {
//     gulp.watch(paths.less, ['less']);
// });

gulp.task('js', function() {
    gulp.src(['javascripts/main.js', 'javascripts/**/*.js', '!javascripts/app.js'])
        .pipe(concat('app.js'))
        // .pipe(ngAnnotate())
        .pipe(gulp.dest('javascripts/'));
});

gulp.task('watch', ['js', 'refresh'], function() {
    livereload.listen();

    gulp.watch(['javascripts/**/*.js', 'javascripts/**/*.html', 'views/**/*.html'], ['js', 'refresh']);
});


gulp.task('refresh', function() {
    livereload.changed();
});
