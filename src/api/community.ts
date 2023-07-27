import express from 'express';

import CommunityController from '../controller/community';
import FileUpload from '../middleware/fileupload';

const router = express.Router();
const communityController = new CommunityController();
const fileUpload = new FileUpload();

router.post('/', fileUpload.upload.single('image'), communityController.apiAddPost);

export default router;
