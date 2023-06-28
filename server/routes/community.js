const express = require('express');

const router = express.Router();
const MiddleWare = require('../middleware');
const Community = require('../controller/community');

const communityController = new Community();
const middleware = new MiddleWare();

router.get('/', communityController.handleGetIndex);

router.post('/', middleware.upload.single('image'), communityController.handlePostIndex);

module.exports = router;
