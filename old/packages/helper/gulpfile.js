// eslint-disable-next-line @typescript-eslint/no-var-requires
const syncy = require('syncy');

exports.default = (done) =>
	syncy(
		[
			'./src/email/**/*.png',
			'./src/email/**/*.jpg',
			'./src/email/**/*.jpeg',
			'./src/email/**/*.svg',
			'./src/email/**/*.html',
		],
		'./dist',
		{
			base: 'src',
			ignoreInDest: ['**/*.js'],
			updateAndDelete: false,
		},
	)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
