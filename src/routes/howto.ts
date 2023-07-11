import express from 'express';

import HowToController from '../controller/howto';

const router = express.Router();

const howToController = new HowToController();

router.get('/', howToController.handleGetIndex);

export default router;
