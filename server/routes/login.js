const express = require('express');

const LoginController = require('../controller/login');
const MiddleWare = require('../middleware');
const Validator = require('../helper/validations');

const router = express.Router();

const loginController = new LoginController();

router.get('/', MiddleWare.redirectProfile, loginController.handleGetIndex);

router.post(
	'/',
	loginController.limiter,
	Validator.loginValidationRules(),
	Validator.validate,
	MiddleWare.redirectProfile,
	loginController.handlePostIndex,
);

router.post(
	'/google-signin',
	loginController.limiter,
	Validator.googlesignupValidationRules(),
	Validator.validate,
	loginController.handlePostGoogleLogin,
);

// @desc    handle facebook signup/login
// @route   POST '/fb-signin'
// @access  Public
// @tested 	Not yet
router.post(
	'/fb-signin',
	loginController.limiter,
	Validator.fbsignupValidationRules(),
	Validator.validate,
	loginController.handlePostFacebookLogin,
);

module.exports = router;
