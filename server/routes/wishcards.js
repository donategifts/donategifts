const express = require('express');

const {
	createWishcardValidationRules,
	createGuidedWishcardValidationRules,
	getByIdValidationRules,
	updateWishCardValidationRules,
	postMessageValidationRules,
	getDefaultCardsValidationRules,
	validate,
} = require('../helper/validations');
const MiddleWare = require('../middleware');
const WishCardHandler = require('../handler/wishcard');

const middleWare = new MiddleWare();
const wishCardHandler = new WishCardHandler();

const router = express.Router();

router.get('/', wishCardHandler.handleGetIndex);

router.post(
	'/',
	wishCardHandler.wishCardHandler.limiter,
	middleWare.renderPermissions,
	middleWare.upload.single('wishCardImage'),
	createWishcardValidationRules(),
	validate,
	wishCardHandler.handlePostIndex,
);

router.post(
	'/guided/',
	wishCardHandler.limiter,
	middleWare.renderPermissions,
	middleWare.upload.single('wishCardImage'),
	createGuidedWishcardValidationRules(),
	validate,
	wishCardHandler.handlePostGuided,
);

router.get(
	'/edit/:id',
	wishCardHandler.limiter,
	middleWare.renderPermissionsRedirect,
	wishCardHandler.handleGetEdit,
);

router.post(
	'/edit/:id',
	wishCardHandler.limiter,
	middleWare.renderPermissions,
	createWishcardValidationRules(),
	validate,
	wishCardHandler.handlePostEdit,
);

router.delete(
	'/delete/:id',
	wishCardHandler.limiter,
	middleWare.renderPermissions,
	wishCardHandler.handleDeleteSingle,
);

router.get('/me', middleWare.renderPermissionsRedirect, wishCardHandler.handleGetMe);

router.get('/create', middleWare.renderPermissionsRedirect, wishCardHandler.handleGetCreate);

router.post('/search/:init?', wishCardHandler.handlePostSearch);

router.get('/single/:id', getByIdValidationRules(), validate, wishCardHandler.handleGetSingle);

router.get(
	'/donate/:id',
	MiddleWare.redirectLogin,
	getByIdValidationRules(),
	wishCardHandler.handleGetDonate,
);

router.get('/get/random', wishCardHandler.handleGetRandom);

// is this still needed? it does nothing actually
router.put(
	'/update/:id',
	middleWare.renderPermissions,
	updateWishCardValidationRules(),
	validate,
	wishCardHandler.handlePutUpdate,
);

router.post(
	'/message',
	MiddleWare.checkVerifiedUser,
	postMessageValidationRules(),
	validate,
	wishCardHandler.handlePostMessage,
);

router.get(
	'/defaults/:id',
	middleWare.renderPermissions,
	getDefaultCardsValidationRules(),
	validate,
	wishCardHandler.handleGetDefaults,
);

router.get('/choose', MiddleWare.redirectLogin, wishCardHandler.handleGetChoose);

module.exports = router;
