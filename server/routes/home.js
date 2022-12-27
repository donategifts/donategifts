const express = require('express');

const router = express.Router();

const HomeHandler = require('../handler/home');

const homeHandler = new HomeHandler();

router.get('/', homeHandler.handleGetIndex);

router.get('/health', homeHandler.handleGetHealth);

module.exports = router;
