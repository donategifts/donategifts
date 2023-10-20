import express from 'express';

import AdminController from '../controller/admin';
import Permissions from '../middleware/permissions';

const router = express.Router();

const adminController = new AdminController();

router.get('/', Permissions.checkAdminPermission, adminController.handleGetIndex);

router.get(
	'/wishcards',
	Permissions.checkAdminPermission,
	adminController.handleGetWishcardsAdministration,
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
