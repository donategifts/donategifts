/* eslint-disable @typescript-eslint/no-var-requires */
const { parallel, task } = require('gulp');
const del = require('del');

task('cleanModules', () => {
  return del(['./node_modules', './don-frontend/node_modules', './don-server/node_modules']);
});

task('cleanDist', () => {
  return del(['./don-server/dist', './don-frontend/dist']);
});

task('cleanBuildInfo', () => {
  return del([
    './tsconfig.tsbuildinfo',
    './don-frontend/tsconfig.tsbuildinfo',
    './don-server/tsconfig.tsbuildinfo',
  ]);
});

exports.superclean = parallel('cleanDist', 'cleanModules', 'cleanBuildInfo');

exports.clean = parallel('cleanDist', 'cleanBuildInfo');
