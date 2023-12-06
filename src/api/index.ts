import { Router } from 'express';

import Permissions from '../middleware/permissions';

import admin from './admin';
import agency from './agency';
import community from './community';
import login from './login';
import payment from './payment';
import profile from './profile';
import signup from './signup';
import team from './team';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/admin', Permissions.checkAdminPermission, admin);
routes.use('/agency', agency);
routes.use('/community', community);
routes.use('/login', login);
routes.use('/payment', payment);
routes.use('/profile', profile);
routes.use('/signup', signup);
routes.use('/team', team);
routes.use('/wishcards', wishcards);
