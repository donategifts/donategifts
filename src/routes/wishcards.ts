import express from 'express';

import WishCardController from '../controller/wishcard';
import FileUpload from '../middleware/fileupload';
import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

const fileUpload = new FileUpload();
const wishCardController = new WishCardController();

const router = express.Router();

router.get('/', wishCardController.handleGetIndex);

router.get(
	'/single/:id',
	Validator.getByIdValidationRules(),
	Validator.validate,
	wishCardController.handleGetSingle,
);

router.get(
	'/donate/:id',
	Permissions.redirectLogin,
	Validator.getByIdValidationRules(),
	wishCardController.handleGetDonate,
);

router.post(
	'/message',
	Permissions.redirectLogin,
	Validator.postMessageValidationRules(),
	Validator.validate,
	wishCardController.handlePostMessage,
);

router.post('/search/:init?', wishCardController.handlePostSearch);

// ------------- only agencies and admins from here on -------------

router.post(
	'/',
	Permissions.isAdminOrAgency,
	fileUpload.upload.single('wishCardImage'),
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostIndex,
);

router.post(
	'/guided/',
	Permissions.isAdminOrAgency,
	fileUpload.upload.single('wishCardImage'),
	Validator.createGuidedWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostGuided,
);

router.get('/edit/:id', Permissions.isAdminOrAgency, wishCardController.handleGetEdit);

router.post(
	'/edit/:id',
	Permissions.isAdminOrAgency,
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostEdit,
);

router.delete('/delete/:id', Permissions.isAdminOrAgency, wishCardController.handleDeleteSingle);

router.get('/manage', Permissions.isAdminOrAgency, wishCardController.handleGetAgency);

router.get('/create', Permissions.isAdminOrAgency, wishCardController.handleGetCreate);

router.get(
	'/defaults/:id',
	Permissions.isAdminOrAgency,
	Validator.getDefaultCardsValidationRules(),
	Validator.validate,
	wishCardController.handleGetDefaults,
);

export default router;
