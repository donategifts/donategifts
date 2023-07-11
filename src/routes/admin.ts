import express from 'express';

import AdminController from '../controller/admin';
import Permissions from '../middleware/permissions';

const router = express.Router();

const adminController = new AdminController();

router.get('/', Permissions.checkAdminPermission, adminController.handleGetIndex);

router.put('/', Permissions.checkAdminPermission, adminController.handlePutIndex);

router.get(
	'/single/:wishCardId',
	Permissions.checkAdminPermission,
	adminController.handleGetWishCard,
);

export default router;
