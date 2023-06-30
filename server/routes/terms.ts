const express = require('express');

const TermsController = require('../controller/terms');

const termsController = new TermsController();

const router = express.Router();

router.get('/', termsController.handleGetIndex);

module.exports = router;
