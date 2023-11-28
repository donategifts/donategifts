import express from 'express';

import { database } from '../db/postgresconnection';

import AdminController from './controller/admin';

const router = express.Router();
const adminController = new AdminController(database);

router.get('/publishWishcards', adminController.handleGetDraftWishcards);

router.put('/publishWishcards', adminController.handlePutDraftWishcard);

router.get('/agencyOverview', adminController.handleGetAgencyOverview);

router.get('/agencyDetail/:agencyId', adminController.handleGetAgencyDetail);

router.put('/verifyAgency/:agencyId', adminController.handlePutVerifyAgency);

router.post('/updateAgencyData/:agencyId', adminController.handleUpdateAgencyData);

router.get('/donations', adminController.handleGetAllDonations);

router.put('/donations', adminController.handlePutUpdateDonationStatus);

export default router;
