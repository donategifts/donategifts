const express = require('express');

const router = express.Router();
const MiddleWare = require('./middleware');
const { donationPostValidation, validate } = require('./validations/donationPost.validations');
const Community = require('../handler/community');

const communityHandler = new Community();
const middleware = new MiddleWare();

router.get('/', communityHandler.handleGetIndex);

router.post(
	'/',
	middleware.upload.single('postImage'),
	MiddleWare.redirectLogin,
	donationPostValidation(),
	validate,
	communityHandler.handlePostIndex,
);

module.exports = router;
