const express = require('express');

const router = express.Router();
const HomeHandler = require('../handler/home');
const MiddleWare = require('./middleware');

const homeHandler = new HomeHandler();

router.get('/health', homeHandler.handleGetHealth);

router.get('/', homeHandler.handleGetIndex);

router.get('/signup', MiddleWare.redirectProfile, homeHandler.handleGetSignup);

router.get('/login', MiddleWare.redirectProfile, homeHandler.handleGetLogin);

module.exports = router;
