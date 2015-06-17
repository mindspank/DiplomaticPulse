var gulp    = require('gulp');
var del     = require('del');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var tap = require('gulp-tap');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var lazypipe = require('lazypipe');
var connect = require('gulp-connect');
var autoprefix = require('gulp-autoprefix');

var paths = {
    base: 'app',
    input: './app/**/*',
    output: './dist/',
    scripts: {
        input: './app/js/*',
        output: './dist/js/'
    },
    styles: {
        input: './app/less/**/*.less',
        output: './dist/css/'
    },
    static: './app/static/**/*',
    vendor: './app/vendor/**/*'
};

function reload() {
  console.log('Reloading')
  livereload.reload();  
};

gulp.task('build:scripts', function() {
    
       var jsTasks = lazypipe()
        .pipe(uglify)
        .pipe(gulp.dest, paths.scripts.output);
        
        return gulp.src(paths.scripts.input)
            .pipe(plumber())
            .pipe(tap(function(file, t) {
                if( file.isDirectory() ) {
                    var name = file.relative + '.js';
                    return gulp.src(file.path + '/*.js')
                        .pipe(concat(name))
                        .pipe(jsTasks());
                }
            }))
            .pipe(jsTasks());
            
});

gulp.task('build:styles', function() {
    return gulp.src(paths.styles.input)
        .pipe( less() )
        .pipe(autoprefix({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(paths.styles.output));  
});

//Copy partials and vendor files
gulp.task('copy:static', function() {
	return gulp.src(['./app/index.html', paths.static, paths.vendor], {
        base: paths.base
    })
    .pipe(gulp.dest(paths.output));
});

//Remove any pre-existing content
gulp.task('clean:dist', function() {
    del.sync([paths.output]);
});


// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
	
    connect.server({
        root: 'dist',
        port: 1337
    });
    
    livereload.listen();

    gulp.watch([paths.styles.input], ['build:styles']).on('change', reload);
    gulp.watch([paths.static, './app/index.html'], ['copy:static']).on('change', reload);
    gulp.watch(['./app/js/**/*'], ['build:scripts']).on('change', reload);

});

/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
	'clean:dist',
	'copy:static',
	'build:scripts',
	'build:styles'
]);

// Compile files, generate docs, and run unit tests (default)
gulp.task('default', ['compile']);

// Compile files, generate docs, and run unit tests when something changes
gulp.task('watch', [
	'listen',
	'default'
]);