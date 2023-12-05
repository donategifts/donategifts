import { Router } from 'express';

import Permissions from '../middleware/permissions';

import admin from './admin';
import agency from './agency';
import community from './community';
import login from './login';
import payment from './payment';
import profile from './profile';
import signup from './signup';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/admin', Permissions.checkAdminPermission, admin);
routes.use('/agency', agency);
routes.use('/community', community);
routes.use('/login.ts', login);
routes.use('/payment', payment);
routes.use('/profile', profile);
routes.use('/signup', signup);
routes.use('/wishcards', wishcards);
