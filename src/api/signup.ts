import express from 'express';

import Validations from '../middleware/validations';

import SignupController from './controller/signup';

const router = express.Router();
const signupController = new SignupController();

router.post('/agency', Validations.validate, signupController.handlePostAgency);

export default router;
