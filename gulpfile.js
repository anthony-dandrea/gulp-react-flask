// Include libraries
var gulp        = require('gulp'),
    minifyCSS   = require('gulp-minify-css'),
    minifyHTML  = require('gulp-minify-html'),
    pngquant    = require('imagemin-pngquant'),
    plugins     = require('gulp-load-plugins')();

var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

// var gulp = require('gulp'),
//     browserify = require('browserify'),
//     reactify = require('reactify'),
//     source = require('vinyl-source-stream');

// gulp.task('browserify', function() {
//     browserify('./src/js/main.js')
//     .transform('reactify')
//     .bundle()
//     .pipe(source('main.js'))
//     .pipe(gulp.dest('dist/js'));
// });

// gulp.task('copy', function() {
//     gulp.src('src/index.html')
//         .pipe(gulp.dest('dist'));
//     gulp.src('src/assets/**/*.*')
//         .pipe(gulp.dest('dist/assets'));
// });

// Run Flask server
gulp.task('server', plugins.shell.task([
    'python site.py'
]));

// Minify templates
gulp.task('templates', function() {
    var opts = {
        comments: true,
        empty: true,
        quotes: true
    };
    return gulp.src('./src/templates/**/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/templates'));
});

// Optimize images
gulp.task('images', function() {
    return gulp.src('./src/static/images/**/*.*')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/static/images'));
});

// Compile and minify sass with compass
// Uses plumber to gracefully fail
gulp.task('styles', function() {
    return gulp.src('./src/static/styles/site.scss')
        .pipe(plugins.plumber({
            errorHandler: function(err){
                console.log(err.toString());
                this.emit('end');
            }
        }))
        .pipe(plugins.compass({
            css: 'dist/static/styles',
            sass: 'src/static/styles',
            image: 'src/static/images',
            require: ['breakpoint']
        }))
        .on('error', function(err) {
        console.log(err.toString());
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/static/styles'))
});

// Watch listeners
gulp.task('watch', function() {
    gulp.watch('./src/static/styles/**/*.scss', ['styles']);
    gulp.watch('./src/templates/**/*.html', ['templates']);
    gulp.watch('./src/static/images/**/*.*', ['images']);
});

// Default gulp task
gulp.task('default', ['styles', 'templates', 'images', 'server', 'watch']);
