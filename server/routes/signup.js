const express = require('express');
const rateLimit = require('express-rate-limit');

const SignupHandler = require('../handler/signup');
const MiddleWare = require('./middleware');
const {
	signupValidationRules,
	validate,
	createAgencyValidationRules,
} = require('./validations/users.validations');

const router = express.Router();

const signupHandler = new SignupHandler();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
});

router.get('/', MiddleWare.redirectProfile, signupHandler.handleGetSignup);

router.post('/', limiter, signupValidationRules(), validate, signupHandler.handlePostSignup);

router.get('/agency', MiddleWare.redirectLogin, signupHandler.handleGetAgency);

router.post(
	'/agency',
	limiter,
	createAgencyValidationRules(),
	validate,
	signupHandler.handlePostAgency,
);

module.exports = router;
