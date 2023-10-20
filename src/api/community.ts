import express from 'express';

import { database } from '../db/postgresconnection';
import FileUpload from '../middleware/fileupload';

import CommunityController from './controller/community';

const router = express.Router();
const communityController = new CommunityController(database);
const fileUpload = new FileUpload();

router.use(communityController.limiter);

router.get('/', communityController.getPosts);

router.post('/', fileUpload.upload.single('image'), communityController.addPost);

export default router;
