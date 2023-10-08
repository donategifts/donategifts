import express from 'express';

import AdminController from './controller/admin';

const router = express.Router();
const agencyController = new AdminController();

router.get('/', agencyController.handleGetDraftWishcards);
router.put('/', agencyController.handlePutDraftWishcard);

export default router;
