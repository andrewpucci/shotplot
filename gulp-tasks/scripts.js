const gulp = require('gulp');
const env = require('gulp-environment');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const project = require('./toolchest/_project.js');

/*
  Uglify our javascript files into one.
*/
gulp.task('js', () => gulp.src(project.paths.scripts.custom.src)
  .pipe(concat('scripts.js'))
  .pipe(env.if.production(terser()))
  .pipe(gulp.dest(project.paths.scripts.custom.dest)));

gulp.task('js:deps', () => gulp.src(project.paths.scripts.deps.src)
  .pipe(concat('deps.js'))
  .pipe(env.if.production(terser()))
  .pipe(gulp.dest(project.paths.scripts.deps.dest)));
