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

task('updatePackages', function (cb) {
	const check = pkgJsonPath => {
		try {
			return childProcess
				.execSync(`npx ncu --timeout 240000 -x ejs,webpack,socket.io,mongoose --packageFile ${pkgJsonPath} -u`)
				.toString();
		} catch (error) {
			console.log(`exec error: ${error.message}`);
			process.exit(error.status);
		}
	};
	glob('./**/*/package.json', {}, (er, files) => {
		files.forEach(file => {
			if (file.includes('node_modules')) {
				return;
			}
			// console.log(`command to update: ncu --packageFileDir --packageFile ${file} -u -i`);
			console.log(check(file));
		});
		cb();
	});
});

exports.superclean = parallel('cleanDist', 'cleanTmp', 'cleanModules');

exports.clean = parallel('cleanDist', 'cleanTmp');
