import express from 'express';

import FileUpload from '../middleware/fileupload';
import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

import WishCardApiController from './controller/wishcards';

const router = express.Router();
const wishCardController = new WishCardApiController();
const fileUpload = new FileUpload();

router.get('/agency', Permissions.isAdminOrAgency, wishCardController.handleGetAgencyWishcards);

router.get('/single/:id', wishCardController.handleGetWishCardSingle);

router.put(
	'/agency',
	Permissions.isAdminOrAgency,
	Validator.updateAgencyWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePutAgencyWishCardById,
);

router.post(
	'/',
	Permissions.isAdminOrAgency,
	fileUpload.upload.fields([
		{
			name: 'childImage',
			maxCount: 1,
		},
		{
			name: 'wishItemImage',
			maxCount: 1,
		},
	]),
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostWishCardAsDraft,
);

router.post(
	'/message',
	// Validator.postMessageValidationRules(),
	Validator.validate,
	wishCardController.handlePostMessage,
);

router.post(
	'/delete/:id',
	Validator.deleteWishCardValidationRules(),
	Validator.validate,
	wishCardController.handleDeleteWishCardSingle,
);

export default router;
