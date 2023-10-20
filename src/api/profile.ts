import express from 'express';

import { database } from '../db/postgresconnection';

import ProfileController from './controller/profile';

const router = express.Router();
const profileController = new ProfileController(database);

router.post('/resend-verification-link', profileController.postResendVerificationLink);

export default router;
