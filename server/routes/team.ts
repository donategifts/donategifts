import express from 'express';

import TeamController from '../controller/team';

const teamController = new TeamController();

const router = express.Router();

router.get('/', teamController.handleGetIndex);

export default router;
