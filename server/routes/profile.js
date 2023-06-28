const express = require('express');

const router = express.Router();

const PasswordController = require('../controller/password');
const ProfileController = require('../controller/profile');

const passwordController = new PasswordController();
const profileController = new ProfileController();

const Permissions = require('../middleware/permissions');
const FileUpload = require('../middleware/fileupload');
const Validator = require('../middleware/validations');
const Utils = require('../helper/utils');

const fileUpload = new FileUpload();

router.get('/', Permissions.redirectLogin, profileController.handleGetIndex);

router.put(
	'/',
	Validator.updateProfileValidationRules(),
	Validator.validate,
	Permissions.redirectLogin,
	profileController.handlePutIndex,
);

router.post(
	'/picture',
	profileController.limiter,
	fileUpload.upload.single('profileImage'),
	Validator.validate,
	Permissions.redirectLogin,
	profileController.handlePostImage,
);

router.delete(
	'/picture',
	profileController.limiter,
	Permissions.redirectLogin,
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

router.get('/logout', Permissions.redirectLogin, Utils.logoutUser);

router.get('/donations', Permissions.redirectLogin, profileController.handleGetDonations);

router.get(
	'/verify/:hash',
	Validator.verifyHashValidationRules(),
	Validator.validate,
	profileController.handleGetVerify,
);

module.exports = router;
