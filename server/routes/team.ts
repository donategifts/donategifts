const express = require('express');

const TeamController = require('../controller/team');

const teamController = new TeamController();

const router = express.Router();

router.get('/', teamController.handleGetIndex);

module.exports = router;
