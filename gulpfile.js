var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var ts = require('gulp-typescript');
var merge = require('merge2');

var templateMainPath = 'src/';
var distMainPath = 'dist/';

//var tsProject = ts.createProject(templateMainPath + 'js/tsconfig.json');

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

gulp.task('ts', function () {
    return gulp.src(templateMainPath + 'ts/quasiform.ts')
        .pipe(ts({
            noImplicitAny: true,
			allowSyntheticDefaultImports: true,
            out: 'quasiform.min.js'
        }))
        .pipe(gulp.dest(distMainPath + 'ts'));
});

gulp.task('watch-typescript', ['xxx'], function() {
    gulp.watch(templateMainPath + 'ts/*.ts', ['xxx']);
});

gulp.task('default', ['watch-main']);
gulp.task('ts', ['ts']);