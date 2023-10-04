import { Router } from 'express';

import admin from './admin';
import agency from './agency';
import community from './community';
import profile from './profile';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/admin', admin);
routes.use('/agency', agency);
routes.use('/community', community);
routes.use('/wishcards', wishcards);
routes.use('/profile', profile);
