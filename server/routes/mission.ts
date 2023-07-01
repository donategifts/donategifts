import express from 'express';

import MissionController from '../controller/mission';

const router = express.Router();

const missionController = new MissionController();

router.get('/', missionController.handleGetIndex);

export default router;
