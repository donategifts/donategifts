import express from 'express';

import ContactController from './controller/contact';

const router = express.Router();
const contactController = new ContactController();

router.post('/', contactController.handlePostContactForm);

export default router;
