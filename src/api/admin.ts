import express from 'express';

import AdminController from './controller/admin';

const router = express.Router();
const adminController = new AdminController();

router.get('/publishWishcards', adminController.handleGetDraftWishcards);

router.put('/publishWishcards', adminController.handlePutDraftWishcard);

router.get('/agencyOverview', adminController.handleGetAgencyOverview);

router.get('/agencyDetail/:agencyId', adminController.handleGetAgencyDetail);

router.put('/verifyAgency/:agencyId', adminController.handleVerifyAgency);

router.post('/updateAgencyData/:agencyId', adminController.handleUpdateAgencyData);

export default router;
