const path = require('node:path');

require('dotenv').config({
	path: path.join(__dirname, './config/config.env'),
});

const { src, dest, series } = require('gulp');
const plumber = require('gulp-plumber');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const logger = require('./server/helper/logger');

const isDev = process.env.NODE_ENV === 'development';

const onError = (runner, done) => (error) => {
	logger.error(`error - ${runner}`, error);
	done();
};

const onSuccess = (runner, done) => () => {
	logger.info(`finished - ${runner}`);
	done();
};

const scss = (done) =>
	src('./design/scss/**/*.scss')
		.pipe(plumber(onError('scss', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.css'))
		.pipe(
			sass({
				includePaths: ['./design/scss/**/*.scss', 'node_modules/bootstrap/scss/'],
				outputStyle: 'compressed',
			}),
		)
		.pipe(
			prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
				cascade: true,
			}),
		)
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/assets/css')))
		.on('end', onSuccess('sass', done));

const js = (done) =>
	src(['./js/**/*.js', 'node_modules/bootstrap/dist/js/bootstrap.bundle.js'])
		.pipe(plumber(onError('js', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.js'))
		.pipe(gulpif(!isDev, stripDebug()))
		.pipe(gulpif(!isDev, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/assets/js')))
		.on('end', onSuccess('js', done));

exports.default = series(scss, js);
