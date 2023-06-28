const express = require('express');

const router = express.Router();

const HomeController = require('../controller/home');

const homeController = new HomeController();

router.get('/', homeController.handleGetIndex);

module.exports = router;
