const express = require('express');

const CommunityController = require('../controller/community');
const FileUpload = require('../middleware/fileupload');

const router = express.Router();
const communityController = new CommunityController();
const fileUpload = new FileUpload();

router.post('/', fileUpload.upload.single('image'), communityController.handleAddPost);

module.exports = router;
