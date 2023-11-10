import express from 'express';

import PasswordController from '../controller/password';
import ProfileController from '../controller/profile';
import Utils from '../helper/utils';
import FileUpload from '../middleware/fileupload';
import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

const router = express.Router();

const passwordController = new PasswordController();
const profileController = new ProfileController();

const fileUpload = new FileUpload();

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
	'/password/new/',
	Validator.postPasswordResetValidationRules(),
	Validator.validate,
	passwordController.handlePostNew,
);

router.get(
	'/verify/:hash',
	Validator.verifyHashValidationRules(),
	Validator.validate,
	profileController.handleGetVerify,
);

// ------------ only logged in users from here on ------------

router.get('/', Permissions.redirectLogin, profileController.handleGetIndex);

router.put(
	'/',
	Permissions.redirectLogin,
	Validator.updateProfileValidationRules(),
	Validator.validate,
	profileController.handlePutIndex,
);

router.put(
	'/account',
	Permissions.redirectLogin,
	Validator.updateAccountDetailsRules(),
	Validator.validate,
	profileController.handlePutAccount,
);

router.put(
	'/agency',
	Permissions.redirectLogin,
	Validator.updateAgencyDetailsRules(),
	Validator.validate,
	profileController.handlePutAgency,
);

router.post(
	'/picture',
	Permissions.redirectLogin,
	fileUpload.upload.single('profileImage'),
	Validator.validate,
	profileController.handlePostImage,
);

router.delete('/picture', Permissions.redirectLogin, profileController.handleDeleteImage);

router.get('/donations', Permissions.redirectLogin, profileController.handleGetDonations);

router.get('/logout', Permissions.redirectLogin, Utils.logoutUser);

export default router;
