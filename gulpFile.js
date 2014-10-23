/**
 * Created by brendan on 2014-10-22.
 */
var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	xtend = require('xtend'),
	del = require('del'),
	pngcrush = require('imagemin-pngcrush'),
	minifyCss = require('gulp-minify-css'),
	// this is an arbitrary object that loads all gulp plugins in package.json.
	$ = require("gulp-load-plugins")();

gulp.task('bundle', function () {
	var args = xtend(watchify.args, { debug: true })
	var b = watchify(browserify(args))
	b.on('update', bundle)
	b.add('./src/index.js')

	function bundle() {
		return b.bundle()
			.on('error', function (e) {
				$.util.beep()
				$.util.log($.util.colors.red('Bundle error: ', e.message))
			})
			.pipe(source('src/index.js'))
			.pipe($.rename('bundle.js'))
			.pipe(gulp.dest('./app/scripts'))
			.pipe($.connect.reload())
	}
	return bundle()
})

gulp.task('compass', function () {
		return gulp.src('./app/css/*.scss')
			.pipe($.plumber())
			.pipe($.compass({
				css: 'app/css',
				sass: 'app/css',
				sourcemap: true,
				debug: true,
				comments: true
			}))
			.pipe(gulp.dest('app/css'))
			.pipe($.connect.reload())
});

gulp.task('images', function() {
	return gulp.src('app/images/*.png','app/images/*.gif','app/images/*.jpg')
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('dist/images/'));
})

gulp.task('watch', ['bundle'], function () {

	$.connect.server({
		port: 8000,
		root: 'app',
		livereload: true
	})
	$.util.log('Listening on port: 8000');
	gulp.watch('app/css/*.scss', ['compass']);

});

gulp.task('clean', function(cb) {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del(['dist'], cb);
});

gulp.task('build', ['clean', 'compass', 'images'], function() {

	gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));

	gulp.src('app/css/**/*.css','!./app/*.scss')
		.pipe(minifyCss())
		.pipe(gulp.dest('./dist/css/'));

	return browserify('./src/index.js')
		.bundle()
		//Pass desired output filename to vinyl-source-stream
		.pipe(source('bundle.js'))
		// Start piping stream to tasks!
		.pipe(gulp.dest('./app/scripts/'))
		.pipe($.streamify($.uglify()) )
//		.pipe($.streamify($.concat('bundle.js')) )
//		.pipe( $.concat('bundle.js') )
		.pipe( gulp.dest('dist/scripts/'))

});

// Default Task
gulp.task('default', ['watch']);