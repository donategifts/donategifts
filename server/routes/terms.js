const express = require('express');
const TermsHandler = require('../handler/terms');

const termsHandler = new TermsHandler();

const router = express.Router();

router.get('/', termsHandler.handleGetIndex);

module.exports = router;
