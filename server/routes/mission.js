const express = require('express');

const MissionHandler = require('../handler/mission');

const router = express.Router();

const missionHandler = new MissionHandler();

router.get('/', missionHandler.handleGetIndex);

module.exports = router;
