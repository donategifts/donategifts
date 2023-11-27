import express from 'express';

import FileUpload from '../middleware/fileupload';

import CommunityController from './controller/community';

const router = express.Router();
const communityController = new CommunityController();
const fileUpload = new FileUpload();

router.use(communityController.limiter);

router.get('/', communityController.getPosts);

router.post('/', fileUpload.upload.single('image'), communityController.addPost);

router.get('/', communityController.handleGetIndex);

export default router;
