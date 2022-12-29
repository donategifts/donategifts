const express = require('express');

const SignupHandler = require('../handler/signup');
const MiddleWare = require('../middleware');
const {
	signupValidationRules,
	validate,
	createAgencyValidationRules,
} = require('../helper/validations');

const router = express.Router();

const signupHandler = new SignupHandler();

router.get('/', MiddleWare.redirectProfile, signupHandler.handleGetIndex);

router.post(
	'/',
	signupHandler.limiter,
	signupValidationRules(),
	validate,
	signupHandler.handlePostSignup,
);

router.get('/agency', MiddleWare.redirectLogin, signupHandler.handleGetAgency);

router.post(
	'/agency',
	signupHandler.limiter,
	createAgencyValidationRules(),
	validate,
	signupHandler.handlePostAgency,
);

module.exports = router;
