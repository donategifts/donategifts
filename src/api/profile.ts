import express from 'express';

import { database } from '../db/postgresconnection';
import FileUpload from '../middleware/fileupload';
import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

import ProfileController from './controller/profile';

const router = express.Router();
const profileController = new ProfileController(database);

const fileUpload = new FileUpload();

router.put(
    '/',
    Permissions.redirectLogin,
    Validator.updateProfileValidationRules(),
    Validator.validate,
    profileController.handlePutIndex,
);

router.put(
    '/account',
    Permissions.redirectLogin,
    Validator.updateAccountDetailsRules(),
    Validator.validate,
    profileController.handlePutAccount,
);

router.put(
    '/agency',
    Permissions.redirectLogin,
    Validator.updateAgencyDetailsRules(),
    Validator.validate,
    profileController.handlePutAgency,
);

router.post(
    '/picture',
    Permissions.redirectLogin,
    fileUpload.upload.single('profileImage'),
    Validator.validate,
    profileController.handlePostImage,
);

router.delete('/picture', Permissions.redirectLogin, profileController.handleDeleteImage);
router.get('/donations', profileController.getDonations);

export default router;
