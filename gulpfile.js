var gulp = require('gulp'); // Подключаем Gulp
var sass = require('gulp-sass'); //Подключаем Sass пакет,
var concat = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
var uglify = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
var rename = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов

var templateMainPath = 'src/';
var distMainPath = 'dist/';

gulp.task('sass-main', function() {
    return gulp.src(templateMainPath + 'sass/main.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        //.pipe(sourcemaps.write())
        //.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(rename('quasiform.min.css')) // Добавляем суффикс .min
        .pipe(gulp.dest(distMainPath + 'css'))
});

gulp.task('js-main', function() {
    return gulp.src([
            templateMainPath + 'js/quasiform.js',
        ])
        .pipe(concat('quasiform.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distMainPath + 'js'));
});

gulp.task('watch-main', ['sass-main', 'js-main'], function() {
    gulp.watch(templateMainPath + 'sass/*.scss', ['sass-main']);
    gulp.watch(templateMainPath + 'js/*.js', ['js-main']);
});

gulp.task('default', ['watch-main']);