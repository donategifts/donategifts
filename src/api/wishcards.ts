import express from 'express';

import Permissions from '../middleware/permissions';
import Validations from '../middleware/validations';

import WishCardApiController from './controller/wishcards';

const router = express.Router();
const wishCardController = new WishCardApiController();

router.get('/agency', Permissions.isAdminOrAgency, wishCardController.getAgencyWishcards);

router.put(
	'/agency',
	Permissions.isAdminOrAgency,
	Validations.updateAgencyWishcardValidationRules(),
	Validations.validate,
	wishCardController.putAgencyWishCardById,
);

export default router;
