const express = require('express');

const router = express.Router();
const ContactController = require('../controller/contact');

const contactController = new ContactController();

router.get('/', contactController.handleGetIndex);

router.post('/email', contactController.handlePostEmail);

router.post('/customer-service', contactController.handlePostCustomerService);

module.exports = router;
