import express from 'express';

import FaqController from '../controller/faq';

const router = express.Router();

const faqController = new FaqController();

router.get('/', faqController.handleGetIndex);

export default router;
