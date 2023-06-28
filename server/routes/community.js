const express = require('express');

const router = express.Router();
const Community = require('../controller/community');

const communityController = new Community();

router.get('/', communityController.handleGetIndex);

module.exports = router;
