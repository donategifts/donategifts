import express from 'express';

import AdminController from './controller/admin';

const router = express.Router();
const adminController = new AdminController();

router.get('/agencyOverview', adminController.handleGetAgencyOverview);

router.get('/agencyDetail/:agencyId', adminController.handleGetAgencyDetail);

export default router;
