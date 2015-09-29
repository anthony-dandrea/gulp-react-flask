// Include libraries
// plugins is able to bring some libraries dynamically
var gulp        = require('gulp'),
    minifyCSS   = require('gulp-minify-css'),
    minifyHTML  = require('gulp-minify-html'),
    pngquant    = require('imagemin-pngquant'),
    webpack     = require('gulp-webpack'),
    webpackConf = require('./webpack.config.js'),
    plugins     = require('gulp-load-plugins')();

// Webpack handles scripts 
// Creates a script for each file for each language
gulp.task('webpack', function() {
    return gulp.src('./src/scripts/script.js')
        .pipe(webpack(webpackConf))
        .pipe(gulp.dest('./dist/static/scripts'))
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
        .pipe(plugins.autoprefixer({browsers: ['last 2 versions']}))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/static/styles'))
});

// Change i18n .po files to .json
gulp.task('i18n', function () {
  return gulp.src('./src/locale/*.po', {read: false})
    .pipe(plugins.shell([
      'i18next-conv -l es -s <%= file.path %> -t <%= f(file.path) %>'
    ], {
      templateData: {
        f: function (s) {
          return s.replace(/$/, '.json')
        }
      }
    }))
})

// Build i18n specific files with webpack
gulp.task('build-i18n', plugins.shell.task([
    'webpack --config webpack.i18n.build.config.js'
]));

// Watch listeners
gulp.task('watch', function() {
    gulp.watch('./src/static/styles/**/*.scss', ['styles']);
    gulp.watch('./src/templates/**/*.html', ['templates']);
    gulp.watch('./src/static/images/**/*.*', ['images']);
    gulp.watch('./src/locale/*.po', ['i18n']);
});

// Default gulp task
gulp.task('default', ['styles', 'templates', 'webpack', 'server', 'watch']);
// Build i18n gulp task
gulp.task('build', ['i18n', 'build-i18n']);
