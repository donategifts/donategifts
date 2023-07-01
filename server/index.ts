import app from './app';
import log from './helper/logger';

(async () => {
	app.listen(process.env.PORT, () => {
		log.info(`App listening on port ${process.env.PORT}`);
	});

	process.on('uncaughtException', (err) => {
		log.error(err);
	});
})();
