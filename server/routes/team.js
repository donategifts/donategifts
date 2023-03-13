const express = require('express');
const TeamHandler = require('../handler/team');

const teamHandler = new TeamHandler();

const router = express.Router();

router.get('/', teamHandler.handleGetIndex);

module.exports = router;
