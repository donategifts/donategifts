import { Router } from 'express';

import Permissions from '../middleware/permissions';

import admin from './admin';
import agency from './agency';
import community from './community';
import payment from './payment';
import profile from './profile';
import signup from './signup';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/admin', Permissions.checkAdminPermission, admin);
routes.use('/agency', agency);
routes.use('/community', community);
routes.use('/wishcards', wishcards);
routes.use('/profile', profile);
routes.use('/admin', admin); //@Enubia - why is there two /admin ??
routes.use('/signup', signup);
routes.use('/payment', payment);
