import express from 'express';

import ContactController from '../controller/contact';

const router = express.Router();

const contactController = new ContactController();

router.get('/', contactController.handleGetIndex);

router.post('/email', contactController.handlePostEmail);

router.post('/customer-service', contactController.handlePostCustomerService);

export default router;
