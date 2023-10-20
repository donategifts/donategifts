import express, { NextFunction, Request, Response } from 'express';

import Permissions from '../middleware/permissions';

const router = express.Router();

router.get(
	'/',
	Permissions.checkAdminPermission,
	(_req: Request, res: Response, _next: NextFunction) => {
		return res.render('pages/admin/index');
	},
);

export default router;
