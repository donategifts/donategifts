const express = require('express');

const router = express.Router();
const WishCardMiddleWare = require('./middleware/wishCard.middleware');
const { redirectLogin } = require('./middleware/login.middleware');
const { donationPostValidation, validate } = require('./validations/donationPost.validations');
const Community = require('../handler/community');

const communityHandler = new Community();

router.get('/', communityHandler.handleGetIndex);

router.post(
	'/',
	WishCardMiddleWare.upload.single('postImage'),
	redirectLogin,
	donationPostValidation(),
	validate,
	communityHandler.handlePostIndex,
);

module.exports = router;
