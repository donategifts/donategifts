const express = require('express');

const router = express.Router();
const ContactHandler = require('../handler/contact');

const contactHandler = new ContactHandler();

router.get('/', contactHandler.handleGetIndex);

router.post('/email', contactHandler.handlePostEmail);

router.post('/customer-service', contactHandler.handlePostCustomerService);

module.exports = router;
