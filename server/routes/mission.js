const express = require('express');

const MissionController = require('../controller/mission');

const router = express.Router();

const missionController = new MissionController();

router.get('/', missionController.handleGetIndex);

module.exports = router;
