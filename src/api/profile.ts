import express from 'express';

import ProfileController from './controller/profile';

const router = express.Router();
const profileController = new ProfileController();

router.post('/resend-verification-link', profileController.handlePostResendVerificationLink);
router.get('/donations', profileController.handleGetDonations);

export default router;
