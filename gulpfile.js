// Include libraries
// plugins is able to bring some libraries dynamically
var gulp        = require('gulp'),
    minifyCSS   = require('gulp-minify-css'),
    htmlmin     = require('gulp-htmlmin'),
    pngquant    = require('imagemin-pngquant'),
    spawn       = require('child_process').spawn,
    gutil       = require('gulp-util'),
    plugins     = require('gulp-load-plugins')();

// Webpack handles scripts 
// Creates a script for each file for each language
gulp.task('webpack', plugins.shell.task([
    'webpack --watch'
]));

// Run Flask server
gulp.task('server', plugins.shell.task([
    'python site.py'
]));

// Minify templates
gulp.task('templates', function() {
    var opts = {
        collapseWhitespace: true,
        quoteCharacter: "'"
    }
    return gulp.src('./src/templates/**/*.html')
        // Disabled until single quotes work
        // .pipe(htmlmin(opts))
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

// Retire.js
// https://github.com/RetireJS/retire.js#user-content-gulp-task
gulp.task('retire', function() {
    // Spawn Retire.js as a child process
    // You can optionally add option parameters to the second argument (array)
    var child = spawn('retire', [], {cwd: process.cwd()});
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        gutil.log(data);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });
});

// Watch listeners
gulp.task('watch', function() {
    gulp.watch('./src/static/styles/**/*.scss', ['styles']);
    gulp.watch('./src/templates/**/*.html', ['templates']);
    gulp.watch('./src/static/images/**/*.*', ['images']);
    gulp.watch('./src/locale/*.po', ['i18n']);
});

// Default gulp task
gulp.task('default', ['styles', 'i18n', 'templates', 'webpack', 'server', 'watch']);
// Run testing tasks
gulp.task('test', ['retire']);
