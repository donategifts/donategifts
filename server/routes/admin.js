const express = require('express');

const AdminController = require('../controller/admin');
const Permissions = require('../middleware/permissions');

const router = express.Router();

const adminController = new AdminController();

router.use(Permissions.checkAdminPermission);

router.get('/', adminController.handleGetIndex);

router.put('/', adminController.handlePutIndex);

router.get('/single/:wishCardId', adminController.handleGetWishCard);

module.exports = router;
