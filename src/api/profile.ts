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

router.get('/donations', profileController.handleGetDonations);

export default router;
