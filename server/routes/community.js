const express = require('express');

const router = express.Router();
const MiddleWare = require('../middleware');
const Validator = require('../helper/validations');
const Community = require('../controller/community');

const communityController = new Community();
const middleware = new MiddleWare();

router.get('/', communityController.handleGetIndex);

router.post(
	'/',
	middleware.upload.single('postImage'),
	MiddleWare.redirectLogin,
	Validator.donationPostValidation(),
	Validator.validate,
	communityController.handlePostIndex,
);

module.exports = router;
