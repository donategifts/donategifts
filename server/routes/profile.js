const express = require('express');

const router = express.Router();

const PasswordHandler = require('../handler/password');
const ProfileHandler = require('../handler/profile');

const passwordHandler = new PasswordHandler();
const profileHandler = new ProfileHandler();

const MiddleWare = require('../middleware');
const {
	verifyHashValidationRules,
	passwordRequestValidationRules,
	updateProfileValidationRules,
	getPasswordResetValidationRules,
	postPasswordResetValidationRules,
	validate,
} = require('../helper/validations');
const Utils = require('../helper/utils');

const middleWare = new MiddleWare();

router.get('/', MiddleWare.redirectLogin, profileHandler.handleGetIndex);

router.put(
	'/',
	updateProfileValidationRules(),
	validate,
	MiddleWare.redirectLogin,
	profileHandler.handlePutIndex,
);

router.post(
	'/picture',
	profileHandler.limiter,
	middleWare.upload.single('profileImage'),
	validate,
	MiddleWare.redirectLogin,
	profileHandler.handlePostImage,
);

router.delete(
	'/picture',
	profileHandler.limiter,
	MiddleWare.redirectLogin,
	profileHandler.handleDeleteImage,
);

router.get('/password/reset', passwordHandler.handleGetReset);

router.post(
	'/password/reset',
	profileHandler.limiter,
	passwordRequestValidationRules(),
	validate,
	passwordHandler.handlePostReset,
);

router.get(
	'/password/reset/:token',
	getPasswordResetValidationRules(),
	validate,
	passwordHandler.handleGetResetToken,
);

router.post(
	'/password/reset/:token',
	profileHandler.limiter,
	postPasswordResetValidationRules(),
	validate,
	passwordHandler.handlePostResetToken,
);

router.get('/logout', MiddleWare.redirectLogin, Utils.logoutUser);

router.get('/donations', MiddleWare.redirectLogin, profileHandler.handleGetDonations);

router.get('/verify/:hash', verifyHashValidationRules(), validate, profileHandler.handleGetVerify);

module.exports = router;
