import express from 'express';

import ProfileController from '../controller/profile';

const router = express.Router();
const profileController = new ProfileController();

router.get('/', profileController.apiGetAgency);

export default router;
