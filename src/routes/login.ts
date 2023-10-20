import express from 'express';

import LoginController from '../controller/login';
import Permissions from '../middleware/permissions';
import Validations from '../middleware/validations';

const router = express.Router();

const loginController = new LoginController();

router.get('/', Permissions.redirectProfile, loginController.handleGetIndex);

router.post(
	'/google-signin',
	Validations.googlesignupValidationRules(),
	Validations.validate,
	loginController.handlePostGoogleLogin,
);

router.post(
	'/fb-signin',
	Validations.fbsignupValidationRules(),
	Validations.validate,
	loginController.handlePostFacebookLogin,
);

router.post(
	'/',
	Validations.loginValidationRules(),
	Validations.validate,
	loginController.handlePostIndex,
);

export default router;
