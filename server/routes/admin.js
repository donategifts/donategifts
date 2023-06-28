const express = require('express');

const AdminController = require('../controller/admin');
const Permissions = require('../middleware/permissions');

const router = express.Router();

const adminController = new AdminController();

router.get('/', Permissions.checkAdminPermission, adminController.handleGetIndex);

router.put('/', Permissions.checkAdminPermission, adminController.handlePutIndex);

router.get(
	'/single/:wishCardId',
	Permissions.checkAdminPermission,
	adminController.handleGetWishCard,
);

module.exports = router;
