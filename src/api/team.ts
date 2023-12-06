import express from 'express';

import TeamController from './controller/team';

const router = express.Router();
const teamController = new TeamController();

router.get('/contributors', teamController.handleGetGithubContributors);

export default router;
