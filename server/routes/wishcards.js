const express = require('express');

const Validator = require('../middleware/validations');
const Permissions = require('../middleware/permissions');
const FileUpload = require('../middleware/fileupload');
const WishCardController = require('../controller/wishcard');

const fileUpload = new FileUpload();
const wishCardController = new WishCardController();

const router = express.Router();

router.use(wishCardController.limiter);

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

router.get('/get/random', wishCardController.handleGetRandom);

router.post(
	'/message',
	Permissions.checkUserVerification,
	Validator.postMessageValidationRules(),
	Validator.validate,
	wishCardController.handlePostMessage,
);

router.post('/search/:init?', wishCardController.handlePostSearch);

// ------------- only agencies and admins from here on -------------

router.use(Permissions.isAdminOrAgency);

router.get('/choose', wishCardController.handleGetChoose);

router.post(
	'/',
	fileUpload.upload.single('wishCardImage'),
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostIndex,
);

router.post(
	'/guided/',
	fileUpload.upload.single('wishCardImage'),
	Validator.createGuidedWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostGuided,
);

router.get('/edit/:id', wishCardController.handleGetEdit);

router.post(
	'/edit/:id',
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostEdit,
);

router.delete('/delete/:id', wishCardController.handleDeleteSingle);

router.get('/me', wishCardController.handleGetMe);

router.get('/create', wishCardController.handleGetCreate);

// is this still needed? it does nothing actually
router.put(
	'/update/:id',
	Validator.updateWishCardValidationRules(),
	Validator.validate,
	wishCardController.handlePutUpdate,
);

router.get(
	'/defaults/:id',
	Validator.getDefaultCardsValidationRules(),
	Validator.validate,
	wishCardController.handleGetDefaults,
);

module.exports = router;
