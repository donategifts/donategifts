import express from 'express';

import { database } from '../db/postgresconnection';

import AgencyController from './controller/agency';

const router = express.Router();
const agencyController = new AgencyController(database);

router.get('/details', agencyController.handleGetDetails);

export default router;
