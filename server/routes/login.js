const express = require('express');
const rateLimit = require('express-rate-limit');

const LoginHandler = require('../handler/login');
const MiddleWare = require('./middleware');
const {
	loginValidationRules,
	validate,
	googlesignupValidationRules,
	fbsignupValidationRules,
} = require('./validations/users.validations');

const router = express.Router();

const loginHandler = new LoginHandler();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
});

router.get('/', MiddleWare.redirectProfile, loginHandler.handleGetIndex);

router.post(
	'/',
	limiter,
	loginValidationRules(),
	validate,
	MiddleWare.redirectProfile,
	loginHandler.handlePostIndex,
);

router.post(
	'/google-signin',
	limiter,
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
	limiter,
	fbsignupValidationRules(),
	validate,
	loginHandler.handlePostFacebookLogin,
);

module.exports = router;
