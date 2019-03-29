const gulp = require('gulp');
const env = require('gulp-environment');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const project = require('./toolchest/_project.js');

/*
  Uglify our javascript files into one.
*/
gulp.task('js', () => gulp.src(project.paths.scripts.custom.src)
  .pipe(env.if.development(sourcemaps.init()))
  .pipe(babel({
    presets: ['@babel/preset-env'],
  }))
  .pipe(concat('scripts.js'))
  .pipe(env.if.production(terser()))
  .pipe(env.if.development(sourcemaps.write('.')))
  .pipe(gulp.dest(project.paths.scripts.custom.dest)));

gulp.task('js:deps', () => gulp.src(project.paths.scripts.deps.src)
  .pipe(env.if.development(sourcemaps.init()))
  .pipe(concat('deps.js'))
  .pipe(env.if.production(terser()))
  .pipe(env.if.development(sourcemaps.write('.')))
  .pipe(gulp.dest(project.paths.scripts.deps.dest)));
