var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
  return gulp.src('sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('default',function() {
  gulp.watch('sass/styles.scss',['styles']);
});
