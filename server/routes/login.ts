const express = require('express');

const LoginController = require('../controller/login');
const Validations = require('../middleware/validations');

const router = express.Router();

const loginController = new LoginController();

router.use(loginController.limiter);

router.get('/', loginController.handleGetIndex);

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

module.exports = router;
