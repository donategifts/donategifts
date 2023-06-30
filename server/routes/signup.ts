const express = require('express');

const SignupController = require('../controller/signup');
const Permissions = require('../middleware/permissions');
const Validations = require('../middleware/validations');

const router = express.Router();

const signupController = new SignupController();

router.use(signupController.limiter);

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

router.get('/agency', Permissions.redirectLogin, signupController.handleGetAgency);

module.exports = router;
