import express from 'express';

import Community from '../controller/community';

const router = express.Router();

const communityController = new Community();

router.get('/', communityController.handleGetIndex);

export default router;
