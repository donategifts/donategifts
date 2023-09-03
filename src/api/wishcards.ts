import express from 'express';

import Permissions from '../middleware/permissions';

import WishCardApiController from './controller/wishcards';

const router = express.Router();
const wishCardController = new WishCardApiController();

router.get('/agency_me', Permissions.isAdminOrAgency, wishCardController.getAgencyWishcards);

export default router;
