import express from 'express';

import TermsController from '../controller/terms';

const termsController = new TermsController();

const router = express.Router();

router.get('/', termsController.handleGetIndex);

export default router;
