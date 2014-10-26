var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
//  gulp.watch(paths.sass, ['sass']);
});

gulp.task('js', function() {
    gulp.src(['www/js/main.js', 'www/js/**/*.js', '!www/js/app.js'])
        // .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        // .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('www/js/'));
});

gulp.task('watch', ['js'], function() {
//    gulp.watch('www/js/**/*.js', ['js']);
});
