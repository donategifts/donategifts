import express from 'express';

import Permissions from '../middleware/permissions';

const router = express.Router();

router.get('/', Permissions.redirectProfile, (_req, res, _next) => {
	return res.render('pages/login');
});

export default router;
