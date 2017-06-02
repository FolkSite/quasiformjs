var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var templateMainPath = 'src/';
var distMainPath = 'dist/';
var reload = browserSync.reload;

gulp.task('sass-main', function() {
    return gulp.src(templateMainPath + 'sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        //.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(rename('quasiform.min.css'))
        .pipe(gulp.dest(distMainPath + 'css'))
        .pipe(reload({
            stream: true
        }))
		.pipe(browserSync.stream());;
});

gulp.task('js-main', function() {
    return gulp.src([
            templateMainPath + 'js/quasiform.js',
        ])
        .pipe(concat('quasiform.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(distMainPath + 'js'))
        .pipe(reload({
            stream: true
        }))
		.pipe(browserSync.stream());
});

gulp.task('watch-main', ['sass-main', 'js-main'], function() {
    gulp.watch(templateMainPath + 'sass/*.scss', ['sass-main', 'sync-main']);
    gulp.watch(templateMainPath + 'js/*.js', ['js-main']);
});

gulp.task('sync', ['sass-main', 'js-main'], function() {
    browserSync.init({
		proxy: 'http://quasiform.local/test',
        host: 'quasiform.local',
    });
	gulp.watch(templateMainPath + 'sass/*.scss', ['sass-main']);
    gulp.watch(templateMainPath + 'js/*.js', ['js-main']);
    browserSync.reload();
});

//gulp.task('default', ['watch-main']);
gulp.task('default', ['sync']);
