import express from 'express';

import { database } from '../db/postgresconnection';

import SignupController from './controller/signup';

const router = express.Router();
const signupController = new SignupController(database);

router.post('/signup', signupController.handlePostSignup);
router.post('/agency', signupController.handlePostAgency);

export default router;
