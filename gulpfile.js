const { parallel, task } = require('gulp');
const del = require('del');
const glob = require('glob');
const childProcess = require('child_process');

task('cleanModules', function () {
	return del(['./node_modules', '**/node_modules'], { force: true, dot: true });
});

task('cleanTmp', function () {
	return del(['**/tsconfig.tsbuildinfo'], { force: true, dot: true });
});

task('cleanDist', function () {
	return del(['./dist', '**/dist'], {
		force: true,
		dot: true,
	});
});

exports.superclean = parallel('cleanDist', 'cleanTmp', 'cleanModules');

exports.clean = parallel('cleanDist', 'cleanTmp');
