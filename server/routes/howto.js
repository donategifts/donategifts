const express = require('express');

const router = express.Router();
const HowToHandler = require('../handler/howto');

const howToHandler = new HowToHandler();

router.get('/', howToHandler.handleGetIndex);

module.exports = router;
