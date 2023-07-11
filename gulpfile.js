const path = require('node:path');

require('dotenv').config({
	path: path.join(__dirname, './config/config.env'),
});

const { src, dest, series, watch, task } = require('gulp');
const prefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const sass = require('gulp-dart-sass');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');

const isDev = process.env.NODE_ENV === 'development';

const onError = (runner, done) => (error) => {
	console.error(`error - ${runner}`, error);
	done();
};

const onSuccess = (runner, done) => () => {
	console.info(`finished - ${runner}`);
	done();
};

const scss = (done) =>
	src('./design/scss/**/*.scss')
		.pipe(plumber(onError('scss', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.css'))
		.pipe(
			sass({
				includePaths: ['./design/scss/**/*.scss', 'node_modules/bootstrap/scss/**/*.scss'],
				outputStyle: 'compressed',
			}),
		)
		.pipe(
			prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
				cascade: true,
			}),
		)
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/css')))
		.on('end', onSuccess('sass', done));

const js = (done) =>
	src(['./js/app/**/*.js', 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'])
		.pipe(plumber(onError('js', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.js'))
		.pipe(gulpif(!isDev, stripDebug()))
		.pipe(gulpif(!isDev, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/js')))
		.on('end', onSuccess('js', done));

task('watch', () => watch(['./design/scss/**/*.scss', './js/**/*.js'], series(scss, js)));

exports.default = series(scss, js);
