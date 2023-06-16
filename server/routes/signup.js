const express = require('express');

const SignupController = require('../controller/signup');
const MiddleWare = require('../middleware');
const Validator = require('../helper/validations');

const router = express.Router();

const signupController = new SignupController();

router.get('/', MiddleWare.redirectProfile, signupController.handleGetIndex);

router.post(
	'/',
	signupController.limiter,
	Validator.signupValidationRules(),
	Validator.validate,
	signupController.handlePostSignup,
);

router.get('/agency', MiddleWare.redirectLogin, signupController.handleGetAgency);

router.post(
	'/agency',
	signupController.limiter,
	Validator.createAgencyValidationRules(),
	Validator.validate,
	signupController.handlePostAgency,
);

module.exports = router;
