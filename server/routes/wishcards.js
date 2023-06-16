const express = require('express');

const Validator = require('../helper/validations');
const MiddleWare = require('../middleware');
const WishCardController = require('../controller/wishcard');

const middleWare = new MiddleWare();
const wishCardController = new WishCardController();

const router = express.Router();

router.get('/', wishCardController.handleGetIndex);

router.post(
	'/',
	wishCardController.limiter,
	middleWare.renderPermissions,
	middleWare.upload.single('wishCardImage'),
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostIndex,
);

router.post(
	'/guided/',
	wishCardController.limiter,
	middleWare.renderPermissions,
	middleWare.upload.single('wishCardImage'),
	Validator.createGuidedWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostGuided,
);

router.get(
	'/edit/:id',
	wishCardController.limiter,
	middleWare.renderPermissionsRedirect,
	wishCardController.handleGetEdit,
);

router.post(
	'/edit/:id',
	wishCardController.limiter,
	middleWare.renderPermissions,
	Validator.createWishcardValidationRules(),
	Validator.validate,
	wishCardController.handlePostEdit,
);

router.delete(
	'/delete/:id',
	wishCardController.limiter,
	middleWare.renderPermissions,
	wishCardController.handleDeleteSingle,
);

router.get('/me', middleWare.renderPermissionsRedirect, wishCardController.handleGetMe);

router.get('/create', middleWare.renderPermissionsRedirect, wishCardController.handleGetCreate);

router.post('/search/:init?', wishCardController.handlePostSearch);

router.get(
	'/single/:id',
	Validator.getByIdValidationRules(),
	Validator.validate,
	wishCardController.handleGetSingle,
);

router.get(
	'/donate/:id',
	MiddleWare.redirectLogin,
	Validator.getByIdValidationRules(),
	wishCardController.handleGetDonate,
);

router.get('/get/random', wishCardController.handleGetRandom);

// is this still needed? it does nothing actually
router.put(
	'/update/:id',
	middleWare.renderPermissions,
	Validator.updateWishCardValidationRules(),
	Validator.validate,
	wishCardController.handlePutUpdate,
);

router.post(
	'/message',
	MiddleWare.checkVerifiedUser,
	Validator.postMessageValidationRules(),
	Validator.validate,
	wishCardController.handlePostMessage,
);

router.get(
	'/defaults/:id',
	middleWare.renderPermissions,
	Validator.getDefaultCardsValidationRules(),
	Validator.validate,
	wishCardController.handleGetDefaults,
);

router.get('/choose', MiddleWare.redirectLogin, wishCardController.handleGetChoose);

module.exports = router;
