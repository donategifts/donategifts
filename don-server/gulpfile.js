/* eslint-disable @typescript-eslint/no-var-requires */
const { parallel, task } = require('gulp');
const del = require('del');

task('cleanModules', () => {
  return del(['./node_modules']);
});

task('cleanDist', () => {
  return del(['./dist']);
});

task('cleanBuildInfo', () => {
  return del(['./buildcache.tsbuildinfo']);
});

exports.superclean = parallel('cleanDist', 'cleanModules', 'cleanBuildInfo');

exports.clean = parallel('cleanDist', 'cleanBuildInfo');
