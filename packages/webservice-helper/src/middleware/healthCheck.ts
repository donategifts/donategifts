import { IRouter, Router } from 'express';

const healthCheck = (): IRouter => {
	const router = Router();

	router.get('/healthcheck', (_req, res) => {
		res
			.status(200)
			.send(
				`${process.env.npm_package_name} (${
					process.env.npm_package_version
				}) up and running - ${Date.now()}`,
			);
	});

	return router;
};

export default healthCheck;
