import express from 'express';

import FileUpload from '../middleware/fileupload';
import Validations from '../middleware/validations';

import SignupController from './controller/signup';

const router = express.Router();
const signupController = new SignupController();
const fileUpload = new FileUpload();

router.post(
	'/agency',
	fileUpload.upload.fields([
		{
			name: 'agencyImage',
			maxCount: 1,
		},
	]),
	Validations.createAgencyValidationRules(),
	signupController.handlePostAgency,
);

export default router;
