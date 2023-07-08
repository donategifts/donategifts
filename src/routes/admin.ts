import express from 'express';

import AdminController from '../controller/admin';
import Permissions from '../middleware/permissions';

const router = express.Router();

const adminController = new AdminController();

router.use(Permissions.checkAdminPermission);

router.get('/', adminController.handleGetIndex);

router.put('/', adminController.handlePutIndex);

router.get('/single/:wishCardId', adminController.handleGetWishCard);

export default router;
