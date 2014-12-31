
var gulp = require('gulp');
var bsync = require('browser-sync');
var jshint = require('gulp-jshint');

// jshint
gulp.task('lint', function () {
  return gulp.src(['./glcubic.js', 'app/script/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// browser sync
gulp.task('bs-sync', function(){
	bsync.init(
		['./glcubic.js', 'app/scirpt/*.js', 'app/css/*.css', 'app/*.html'],
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
	gulp.watch('glcubic.js',  ['bs-reload']);
	gulp.watch('.app/*.*',    ['bs-reload']);
	gulp.watch('.app/**/*.*', ['bs-reload']);
});

