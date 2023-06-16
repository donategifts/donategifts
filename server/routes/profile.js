const express = require('express');

const router = express.Router();

const PasswordController = require('../controller/password');
const ProfileController = require('../controller/profile');

const passwordController = new PasswordController();
const profileController = new ProfileController();

const MiddleWare = require('../middleware');
const Validator = require('../helper/validations');
const Utils = require('../helper/utils');

const middleWare = new MiddleWare();

router.get('/', MiddleWare.redirectLogin, profileController.handleGetIndex);

router.put(
	'/',
	Validator.updateProfileValidationRules(),
	Validator.validate,
	MiddleWare.redirectLogin,
	profileController.handlePutIndex,
);

router.post(
	'/picture',
	profileController.limiter,
	middleWare.upload.single('profileImage'),
	Validator.validate,
	MiddleWare.redirectLogin,
	profileController.handlePostImage,
);

router.delete(
	'/picture',
	profileController.limiter,
	MiddleWare.redirectLogin,
	profileController.handleDeleteImage,
);

router.get('/password/reset', passwordController.handleGetReset);

router.post(
	'/password/reset',
	profileController.limiter,
	Validator.passwordRequestValidationRules(),
	Validator.validate,
	passwordController.handlePostReset,
);

router.get(
	'/password/reset/:token',
	Validator.getPasswordResetValidationRules(),
	Validator.validate,
	passwordController.handleGetResetToken,
);

router.post(
	'/password/reset/:token',
	profileController.limiter,
	Validator.postPasswordResetValidationRules(),
	Validator.validate,
	passwordController.handlePostResetToken,
);

router.get('/logout', MiddleWare.redirectLogin, Utils.logoutUser);

router.get('/donations', MiddleWare.redirectLogin, profileController.handleGetDonations);

router.get(
	'/verify/:hash',
	Validator.verifyHashValidationRules(),
	Validator.validate,
	profileController.handleGetVerify,
);

module.exports = router;
