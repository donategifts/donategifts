const express = require('express');

const router = express.Router();
const FaqController = require('../controller/faq');

const faqController = new FaqController();

router.get('/', faqController.handleGetIndex);

module.exports = router;
