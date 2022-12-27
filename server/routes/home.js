const express = require('express');

const router = express.Router();

const HomeHandler = require('../handler/home');
const MiddleWare = require('./middleware');
const signupRouter = require('./signup');

const homeHandler = new HomeHandler();

router.get('/', homeHandler.handleGetIndex);

router.get('/health', homeHandler.handleGetHealth);

router.get('/login', MiddleWare.redirectProfile, homeHandler.handleGetLogin);

router.use('/signup', signupRouter);

module.exports = router;
