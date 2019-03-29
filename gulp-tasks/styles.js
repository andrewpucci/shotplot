const gulp = require('gulp');
const env = require('gulp-environment');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const project = require('./toolchest/_project.js');

/*
  generate the css with sass
*/
gulp.task('css', () => gulp.src(project.paths.styles.custom.src)
  .pipe(env.if.development(sourcemaps.init()))
  .pipe(sass({
    outputStyle: 'compressed',
  }).on('error', sass.logError))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(env.if.development(sourcemaps.write('.')))
  .pipe(gulp.dest(project.paths.styles.custom.dest)));

gulp.task('css:deps', () => gulp.src(project.paths.styles.deps.src)
  .pipe(env.if.development(sourcemaps.init()))
  .pipe(concat('deps.css'))
  .pipe(postcss([cssnano()]))
  .pipe(env.if.development(sourcemaps.write('.')))
  .pipe(gulp.dest(project.paths.styles.deps.dest)));
