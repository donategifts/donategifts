const path = require('node:path');

require('dotenv').config({
	path: path.join(__dirname, './config.env'),
});

const { src, dest, series, watch, task } = require('gulp');
const prefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const sass = require('gulp-dart-sass');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
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
	src('./design/scss/style.scss')
		.pipe(plumber(onError('scss', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.css'))
		.pipe(
			sass({
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

const css = (done) =>
	src('./node_modules/@mantine/core/esm/index.css')
		.pipe(plumber(onError('css', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('vendor.min.css'))
		.pipe(
			postcss([
				require('postcss-preset-mantine'),
				require('postcss-simple-vars')({
					variables: {
						'mantine-breakpoint-xs': '36em',
						'mantine-breakpoint-sm': '48em',
						'mantine-breakpoint-md': '62em',
						'mantine-breakpoint-lg': '75em',
						'mantine-breakpoint-xl': '88em',
					},
				}),
			]),
		)
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/css')))
		.on('end', onSuccess('css', done));

const js = (done) =>
	src('./js/app/**/*.js')
		.pipe(plumber(onError('js', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('app.min.js'))
		.pipe(gulpif(!isDev, stripDebug()))
		.pipe(gulpif(!isDev, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/js')))
		.on('end', onSuccess('js', done));

const bootstrap = (done) =>
	src('node_modules/bootstrap/dist/js/bootstrap.bundle.js')
		.pipe(plumber(onError('bootstrap', done)))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(concat('bootstrap.min.js'))
		.pipe(gulpif(!isDev, stripDebug()))
		.pipe(gulpif(!isDev, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(dest(path.join(__dirname, './public/js')))
		.on('end', onSuccess('bootstrap', done));

task('watch', () =>
	watch(['./design/scss/**/*.scss', './js/**/*.js'], series(scss, css, js, bootstrap)),
);

exports.default = series(scss, css, js, bootstrap);
