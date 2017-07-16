const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const jade = require('gulp-jade');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const templateMainPath = 'src/';
const distMainPath = 'dist/';
const reload = browserSync.reload;

gulp.task('sass-main', function() {
  return gulp.src(templateMainPath + 'sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(rename('quasiform.min.css'))
    .pipe(gulp.dest(distMainPath + 'css'))
    .pipe(reload({
      stream: true
    }))
    .pipe(browserSync.stream());
});

gulp.task('watch-main', ['sass-main', 'jade-test'], function() {
  gulp.watch(templateMainPath + 'sass/*.scss', ['sass-main']);
  gulp.watch(templateMainPath + 'jade/index.jade', ['jade-test']);
});

gulp.task('sync', ['sass-main'], function() {
  browserSync.init({
    proxy: 'http://quasiform.local/test',
    host: 'quasiform.local',
  });
  gulp.watch(templateMainPath + 'sass/*.scss', ['sass-main']);
  browserSync.reload();
});

gulp.task('jade-test', function() {
  const YOUR_LOCALS = {};

  gulp.src(templateMainPath + 'jade/index.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true,
    }))
    .pipe(gulp.dest('test/'));
});

gulp.task('default', ['watch-main']);
gulp.task('jade', ['jade-test']);
gulp.task('sync', ['sync']);
gulp.task('watch', ['watch-main']);