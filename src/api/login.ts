import express from 'express';

import Validations from '../middleware/validations';

import LoginController from './controller/login';

const router = express.Router();
const loginController = new LoginController();

router.post(
    '/google-signin',
    Validations.googlesignupValidationRules(),
    Validations.validate,
    loginController.handlePostGoogleLogin,
);

router.post(
    '/fb-signin',
    Validations.fbsignupValidationRules(),
    Validations.validate,
    loginController.handlePostFacebookLogin,
);

router.post(
    '/',
    Validations.loginValidationRules(),
    Validations.validate,
    loginController.handlePostIndex,
);

export default router;
