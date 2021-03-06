var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

//LEVANTA UN SERVIDOR LOCAL
var webserver = require('gulp-webserver');
//ACTUALIZAR EL NAVEGADOR AUTOMATICAMENTE
var livereload = require('gulp-livereload');

/**             STYLUS                **/
//PERMITE  COMPILAR STYLUS
var stylus = require('gulp-stylus');
//AGREGA PREFIJOS A LOS ATRIBUTOS CSS
var nib = require('nib');
//MINIFICA LOS CSS
var minifyCSS = require('gulp-minify-css');

/**             JS               **/
//MINIFICA JS
var uglify = require('gulp-uglify');

/**             JADE               **/
var jade = require('gulp-jade');

//BORRA LA CARPETA PUBLIC CADA VEZ QUE TRABAJE GULP
var clean = require('gulp-rimraf');


var config = {
	styles: {
		main: './src/styles/app.styl', 
		output: './build/css',
		watch: './src/styles/*.styl'
	},
	htmls: {
		main: './src/index.jade',
		output: './build',
		watch: './src/*.jade'
	},
	scripts: {
		main: './src/scripts/app.js',
		output: './build/js',
		watch: './src/scripts/*.js'
	}
}

gulp.task('server', function(){
	gulp
		.src('./build')
		.pipe(webserver({
			host: '0.0.0.0',
			port: 8080
			}));
});

gulp.task('clean', function(){
	return gulp
				.src('./build', {read: false})
				.pipe(clean({force: true}));
	});

gulp.task('build:html', function(){
	gulp
		.src(config.htmls.main)
		.pipe(jade({
			pretty: true
			}))
		.pipe(gulp.dest(config.htmls.output))
		.pipe(livereload());
	});

gulp.task('build:css', function(){
	gulp
		.src(config.styles.main)
		.pipe(stylus({
			use: nib(),
			'include css':true
			}))
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.styles.output))
		.pipe(livereload());
	});

gulp.task('build:js', function(){
	gulp
		.src(config.scripts.main)
		.pipe(uglify())
		.pipe(gulp.dest(config.scripts.output))
		.pipe(livereload());
	});

//Observa los cambios tanto en html, css, y JS
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(config.styles.watch, ['build:css']);
	gulp.watch(config.scripts.watch, ['build:js']);
	gulp.watch(config.htmls.watch, ['build:html']);
	});

//Tarea por default
gulp.task('default',['clean','server','watch'], function(){
	gulp.start('build:css','build:js','build:html');
	});