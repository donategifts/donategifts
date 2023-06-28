const express = require('express');

const Validator = require('../middleware/validations');
const Permissions = require('../middleware/permissions');
const FileUpload = require('../middleware/fileupload');
const WishCardController = require('../controller/wishcard');

const fileUpload = new FileUpload();
const wishCardController = new WishCardController();

const router = express.Router();

router.get('/', wishCardController.handleGetIndex);

router.post(
	'/',
	wishCardController.limiter,
	Permissions.checkViewPermission,
	fileUpload.upload.single('wishCardImage'),
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostIndex,
);

router.post(
	'/guided/',
	wishCardController.limiter,
	Permissions.checkViewPermission,
	fileUpload.upload.single('wishCardImage'),
	Validator.createGuidedWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostGuided,
);

router.get(
	'/edit/:id',
	wishCardController.limiter,
	Permissions.checkViewPermission,
	wishCardController.handleGetEdit,
);

router.post(
	'/edit/:id',
	wishCardController.limiter,
	Permissions.checkViewPermission,
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostEdit,
);

router.delete(
	'/delete/:id',
	wishCardController.limiter,
	Permissions.checkViewPermission,
	wishCardController.handleDeleteSingle,
);

router.get('/me', Permissions.checkViewPermission, wishCardController.handleGetMe);

router.get('/create', Permissions.checkViewPermission, wishCardController.handleGetCreate);

router.post('/search/:init?', wishCardController.handlePostSearch);

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

// is this still needed? it does nothing actually
router.put(
	'/update/:id',
	Permissions.checkViewPermission,
	Validator.updateWishCardValidationRules(),
	Validator.validate,
	wishCardController.handlePutUpdate,
);

router.post(
	'/message',
	Permissions.checkUserVerification,
	Validator.postMessageValidationRules(),
	Validator.validate,
	wishCardController.handlePostMessage,
);

router.get(
	'/defaults/:id',
	Permissions.checkViewPermission,
	Validator.getDefaultCardsValidationRules(),
	Validator.validate,
	wishCardController.handleGetDefaults,
);

router.get('/choose', Permissions.redirectLogin, wishCardController.handleGetChoose);

module.exports = router;
