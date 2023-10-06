import express from 'express';

import { database } from '../db/postgresconnection';

import AdminController from './controller/admin';

const router = express.Router();
const adminController = new AdminController(database);

router.get('/agencyOverview', adminController.handleGetAgencyOverview);

router.get('/agencyDetail/:agencyId', adminController.handleGetAgencyDetail);

router.put('/verifyAgency/:agencyId', adminController.handleVerifyAgency);

router.post('/updateAgencyData/:agencyId', adminController.handleUpdateAgencyData);

export default router;
