const express = require('express');

const AdminController = require('../controller/admin');
const MiddleWare = require('../middleware');

const router = express.Router();

const adminController = new AdminController();

router.get('/', MiddleWare.checkAdminPermission, adminController.handleGetIndex);

router.put('/', MiddleWare.checkAdminPermission, adminController.handlePutIndex);

router.get(
	'/single/:wishCardId',
	MiddleWare.checkAdminPermission,
	adminController.handleGetWishCard,
);

module.exports = router;
