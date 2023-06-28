const express = require('express');
const CommunityController = require('../controller/community');
const MiddleWare = require('../middleware');

const router = express.Router();
const communityController = new CommunityController();
const middleWare = new MiddleWare();

router.post('/', middleWare.upload.single('image'), communityController.handleAddPost);

module.exports = router;
