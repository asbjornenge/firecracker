var gulp       = require('gulp')
var browserify = require('gulp-browserify')
var uglify     = require('gulp-uglify')
var rename     = require('gulp-rename')
var size       = require('gulp-size');
var gzip       = require('gulp-gzip');
var pkg        = require('./package.json')

gulp.task('check-gzip', ['build'], function() {
    return gulp.src('dist/'+pkg.version+'/*.js')
        .pipe(gzip())
        .pipe(size({showFiles:true}))
})

gulp.task('build', function() {
    return gulp.src(pkg.name+'.js')
        .pipe(browserify({
            standalone : pkg.name
        }))
        .pipe(size({showFiles:true}))
        .pipe(gulp.dest('./dist/'+pkg.version))
        .pipe(uglify())
        .pipe(rename(pkg.name+'.min.js'))
        .pipe(size({showFiles:true}))
        .pipe(gulp.dest('./dist/'+pkg.version))
})

gulp.task('default', ['check-gzip'])