import express from 'express';

import { database } from '../db/postgresconnection';
import FileUpload from '../middleware/fileupload';
import Permissions from '../middleware/permissions';
import Validations from '../middleware/validations';

import WishCardApiController from './controller/wishcards';

const router = express.Router();
const fileUpload = new FileUpload();
const wishCardController = new WishCardApiController(database);

router.get('/', wishCardController.handleGetIndex);

/* router.get(
	'/single/:id',
	Validations.getByIdValidationRules(),
	Validations.validate,
	wishCardController.handleGetSingle,
);

router.get(
	'/donate/:id',
	Permissions.redirectLogin,
	Validations.getByIdValidationRules(),
	wishCardController.handleGetDonate,
);

router.post(
	'/message',
	Permissions.checkUserVerification,
	Validations.postMessageValidationRules(),
	Validations.validate,
	wishCardController.handlePostMessage,
);

router.post('/search/:init?', wishCardController.handlePostSearch); */

// ------------- only agencies and admins from here on -------------

router.post(
	'/',
	Permissions.isAdminOrAgency,
	fileUpload.upload.single('wishCardImage'),
	Validations.createWishcardValidationRules(),
	Validations.validate,
	wishCardController.handlePostIndex,
);

router.post(
	'/guided/',
	Permissions.isAdminOrAgency,
	fileUpload.upload.single('wishCardImage'),
	Validations.createGuidedWishcardValidationRules(),
	Validations.validate,
	wishCardController.handlePostGuided,
);

router.get('/edit/:id', Permissions.isAdminOrAgency, wishCardController.handleGetEdit);

router.post(
	'/edit/:id',
	Permissions.isAdminOrAgency,
	Validations.createWishcardValidationRules(),
	Validations.validate,
	wishCardController.handlePostEdit,
);

router.delete('/delete/:id', Permissions.isAdminOrAgency, wishCardController.handleDeleteSingle);

/* router.get('/manage', Permissions.isAdminOrAgency, wishCardController.handleGetAgency);

router.get('/create', Permissions.isAdminOrAgency, wishCardController.handleGetCreate);

router.get(
	'/defaults/:id',
	Permissions.isAdminOrAgency,
	Validations.getDefaultCardsValidationRules(),
	Validations.validate,
	wishCardController.handleGetDefaults,
); */

export default router;
