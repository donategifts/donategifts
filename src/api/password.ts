import express from 'express';

import PasswordController from './controller/password';

const router = express.Router();
const passwordController = new PasswordController();

router.post('/new', passwordController.handlePostNew);

router.post('/reset', passwordController.handlePostReset);

export default router;
