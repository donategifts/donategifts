import express from 'express';

import HomeController from './controller/home';

const router = express.Router();
const homeController = new HomeController();

router.get('/', homeController.handleGetIndex);

export default router;
