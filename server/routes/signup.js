const express = require('express');

const SignupController = require('../controller/signup');
const Permissions = require('../middleware/permissions');
const Validations = require('../middleware/validations');

const router = express.Router();

const signupController = new SignupController();

router.get('/', Permissions.redirectProfile, signupController.handleGetIndex);

router.post(
	'/',
	signupController.limiter,
	Validations.signupValidationRules(),
	Validations.validate,
	signupController.handlePostSignup,
);

router.get('/agency', Permissions.redirectLogin, signupController.handleGetAgency);

router.post(
	'/agency',
	signupController.limiter,
	Validations.createAgencyValidationRules(),
	Validations.validate,
	signupController.handlePostAgency,
);

module.exports = router;
