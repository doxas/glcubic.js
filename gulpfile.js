
// require
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runsqc = require('run-sequence');
var bsync  = require('browser-sync');

// jshint
gulp.task('lint', function(){
	gulp.src([
		'build/glcubic.js',
		'build/glcubic.min.js',
		'src/*.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

// concat
gulp.task('concat', function(){
	gulp.src([
		'src/gl3Core.js',
		'src/gl3Util.js',
		'src/gl3Vector.js',
		'src/gl3Matrix.js',
		'src/gl3Quaternion.js'
	])
	.pipe(concat('glcubic.js'))
	.pipe(gulp.dest('build/'))
	.pipe(rename('glcubic.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('build/'));
});

// build
gulp.task('build', function(){
	runsqc('concat');
});

// browser sync
gulp.task('bs-sync', function(){
	bsync.init(
		['app/scirpt/*.js', 'app/css/*.css', 'app/*.html'],
		{
			port: 8888,
			server: {
				baseDir: './app'
			}
		}
	);
});

// browser reload
gulp.task('bs-reload', function(){
	bsync.reload();
});

// default task
gulp.task('default', ['bs-sync'], function(){
	gulp.watch('.app/*.*',    ['bs-reload']);
	gulp.watch('.app/**/*.*', ['bs-reload']);
});

