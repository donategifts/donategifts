const express = require('express');

const router = express.Router();
const HowToController = require('../controller/howto');

const howToController = new HowToController();

router.get('/', howToController.handleGetIndex);

module.exports = router;
