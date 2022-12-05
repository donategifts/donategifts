const express = require('express');

const router = express.Router();
const HomeHandler = require('../handler/home');

const homeHandler = new HomeHandler();

router.get('/health', homeHandler.handleGetHealth);

router.get('/', homeHandler.handleGetIndex);

module.exports = router;
