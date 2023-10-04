import express from 'express';

import AdminController from '../controller/admin';
import Permissions from '../middleware/permissions';

const router = express.Router();

const adminController = new AdminController();

router.get('/wishcards', Permissions.checkAdminPermission, adminController.handleGetWishcards);

router.put('/wishcards', Permissions.checkAdminPermission, adminController.handlePutWishcards);

router.get(
	'/single/:wishCardId',
	Permissions.checkAdminPermission,
	adminController.handleGetWishCard,
);

router.get(
	'/agencyOverview',
	Permissions.checkAdminPermission,
	adminController.handleGetAgencyOverview,
);

router.get(
	'/agencyDetail/:agencyId',
	Permissions.checkAdminPermission,
	adminController.handleGetAgencyDetail,
);

export default router;
