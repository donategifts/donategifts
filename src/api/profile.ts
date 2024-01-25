import express from 'express';

import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

import ProfileController from './controller/profile';

const router = express.Router();
const profileController = new ProfileController();

router.post('/resend-verification-link', profileController.handlePostResendVerificationLink);

router.put(
	'/agency',
	Permissions.redirectLogin,
	Validator.updateAgencyDetailsRules(),
	Validator.validate,
	profileController.handlePutAgency,
);

router.get('/agency', Permissions.redirectLogin, profileController.handleGetAgency);

router.get('/account', Permissions.redirectLogin, profileController.handleGetAccount);

router.put(
	'/account',
	Permissions.redirectLogin,
	Validator.updateAccountDetailsRules(),
	Validator.validate,
	profileController.handlePutAccount,
);

router.put(
	'/account/aboutMe',
	Permissions.redirectLogin,
	Validator.updateProfileValidationRules(),
	Validator.validate,
	profileController.handlePutAccount,
);

router.get('/donations', profileController.handleGetDonations);

export default router;
