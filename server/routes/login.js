const express = require('express');

const LoginHandler = require('../handler/login');
const MiddleWare = require('../middleware');
const {
	loginValidationRules,
	validate,
	googlesignupValidationRules,
	fbsignupValidationRules,
} = require('../helper/validations');

const router = express.Router();

const loginHandler = new LoginHandler();

router.get('/', MiddleWare.redirectProfile, loginHandler.handleGetIndex);

router.post(
	'/',
	loginHandler.limiter,
	loginValidationRules(),
	validate,
	MiddleWare.redirectProfile,
	loginHandler.handlePostIndex,
);

router.post(
	'/google-signin',
	loginHandler.limiter,
	googlesignupValidationRules(),
	validate,
	loginHandler.handlePostGoogleLogin,
);

// @desc    handle facebook signup/login
// @route   POST '/fb-signin'
// @access  Public
// @tested 	Not yet
router.post(
	'/fb-signin',
	loginHandler.limiter,
	fbsignupValidationRules(),
	validate,
	loginHandler.handlePostFacebookLogin,
);

module.exports = router;
