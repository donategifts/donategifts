const express = require('express');

const router = express.Router();
const FaqHandler = require('../handler/faq');

const faqHandler = new FaqHandler();

router.get('/', faqHandler.handleGetIndex);

module.exports = router;
