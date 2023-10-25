import { Router } from 'express';

import Permissions from '../middleware/permissions';

import admin from './admin';
import agency from './agency';
import community from './community';
import contact from './contact';
import home from './home';
import login from './login';
import password from './password';
import payment from './payment';
import profile from './profile';
import signup from './signup';
import wishcards from './wishcards';

export const routes = Router();

// we should consider making a new set of permission for the api routes
// the current permissions do not handle json responses

routes.use('/admin', Permissions.checkAdminPermission, admin);
routes.use('/agency', Permissions.isAdminOrAgency, agency);
routes.use('/community', community);
routes.use('/contact', contact);
routes.use('/home', home);
routes.use('/login', login);
routes.use('/password', password);
routes.use('/payment', payment);
routes.use('/profile', profile);
routes.use('/signup', signup);
routes.use('/wishcards', wishcards);
