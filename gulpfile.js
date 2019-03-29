const gulp = require('gulp');

/**
  Our gulp tasks live in their own files,
  for the sake of clarity.
 */
require('require-dir')('./gulp-tasks');

/*
  Empty folders that store generated files
*/
gulp.task('clean', gulp.parallel(
  'clean:dest',
  'clean:styles',
  'clean:scripts',
));

/*
  Let's build this sucker.
*/
gulp.task('build', gulp.parallel(
  'css:deps',
  'css',
  'js:deps',
  'js',
));

/*
  Watch folders for changess
*/
gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('css'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
});
