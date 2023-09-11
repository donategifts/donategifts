import express from 'express';

import SignupController from '../controller/signup';
import Permissions from '../middleware/permissions';
import Validations from '../middleware/validations';

const router = express.Router();

const signupController = new SignupController();

router.get('/', Permissions.redirectProfile, signupController.handleGetIndex);

router.post(
	'/',
	Validations.signupValidationRules(),
	Validations.validate,
	signupController.handlePostSignup,
);

router.post(
	'/agency',
	Validations.createAgencyValidationRules(),
	Validations.validate,
	signupController.handlePostAgency,
);

router.get(
	'/agency',
	Permissions.redirectSignup,
	Permissions.redirectProfile,
	signupController.handleGetAgency,
);

export default router;
