import express from 'express';

import AgencyController from './controller/agency';

const router = express.Router();
const profileController = new AgencyController();

router.get('/', profileController.getAgency);

export default router;
