const gulp = require('gulp');
const del = require('del');
const project = require('./toolchest/_project.js');

// cleanup the 11ty build output
gulp.task('clean:dest', () => del(project.paths.build.dest));

// cleanup the css output
gulp.task('clean:styles', () => del(project.paths.styles.custom.dest));

// cleanup the js output
gulp.task('clean:scripts', () => del(project.paths.scripts.custom.dest));
