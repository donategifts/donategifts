const express = require('express');

const router = express.Router();

const PasswordController = require('../controller/password');
const ProfileController = require('../controller/profile');
const Utils = require('../helper/utils');
const FileUpload = require('../middleware/fileupload');
const Permissions = require('../middleware/permissions');
const Validator = require('../middleware/validations');

const passwordController = new PasswordController();
const profileController = new ProfileController();

const fileUpload = new FileUpload();

router.use(profileController.limiter);

router.get('/password/reset', passwordController.handleGetReset);

router.post(
	'/password/reset',
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
	Validator.postPasswordResetValidationRules(),
	Validator.validate,
	passwordController.handlePostResetToken,
);

router.get(
	'/verify/:hash',
	Validator.verifyHashValidationRules(),
	Validator.validate,
	profileController.handleGetVerify,
);

// ------------ only logged in users from here on ------------

router.use(Permissions.redirectLogin);

router.get('/', profileController.handleGetIndex);

router.put(
	'/',
	Validator.updateProfileValidationRules(),
	Validator.validate,
	profileController.handlePutIndex,
);

router.post(
	'/picture',
	fileUpload.upload.single('profileImage'),
	Validator.validate,
	profileController.handlePostImage,
);

router.delete('/picture', profileController.handleDeleteImage);

router.get('/donations', profileController.handleGetDonations);

router.get('/logout', Utils.logoutUser);

module.exports = router;
