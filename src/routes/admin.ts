import express from 'express';

import Permissions from '../middleware/permissions';

const router = express.Router();

router.get('/', Permissions.checkAdminPermission, (_req, res, _next) => res.render('pages/admin/index'));

export default router;
