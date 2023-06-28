const express = require('express');

const LoginController = require('../controller/login');
const Permissions = require('../middleware/permissions');
const Validations = require('../middleware/validations');

const router = express.Router();

const loginController = new LoginController();

router.get('/', Permissions.redirectProfile, loginController.handleGetIndex);

router.post(
	'/',
	loginController.limiter,
	Validations.loginValidationRules(),
	Validations.validate,
	Permissions.redirectProfile,
	loginController.handlePostIndex,
);

router.post(
	'/google-signin',
	loginController.limiter,
	Validations.googlesignupValidationRules(),
	Validations.validate,
	loginController.handlePostGoogleLogin,
);

// @desc    handle facebook signup/login
// @route   POST '/fb-signin'
// @access  Public
// @tested 	Not yet
router.post(
	'/fb-signin',
	loginController.limiter,
	Validations.fbsignupValidationRules(),
	Validations.validate,
	loginController.handlePostFacebookLogin,
);

module.exports = router;
