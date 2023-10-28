import express from 'express';

import { database } from '../db/postgresconnection';

import HomeController from './controller/home';

const router = express.Router();
const homeController = new HomeController(database);

router.get('/', homeController.handleGetIndex);

export default router;
