// Include libraries
// plugins is able to bring some libraries dynamically
var gulp        = require('gulp'),
    minifyCSS   = require('gulp-minify-css'),
    minifyHTML  = require('gulp-minify-html'),
    pngquant    = require('imagemin-pngquant'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    plugins     = require('gulp-load-plugins')();

// Compile jsx es6 scripts
// http://www.jayway.com/2015/03/04/using-react-with-ecmascript-6/
gulp.task('jsx', function () {
  browserify({
    entries: './src/static/scripts/script.js',
    extensions: ['.js'],
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(plugins.uglify())
  .pipe(gulp.dest('dist/static/scripts'));
});

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
    gulp.watch('./src/static/scripts/**/*.*', ['jsx']);
});

// Default gulp task
gulp.task('default', ['styles', 'templates', 'jsx', 'server', 'watch']);
