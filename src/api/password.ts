import express from 'express';

import { database } from '../db/postgresconnection';

import PasswordController from './controller/password';

const router = express.Router();
const passwordController = new PasswordController(database);

router.post('/new', passwordController.handlePostNew);

router.post('/reset', passwordController.handlePostReset);

export default router;
