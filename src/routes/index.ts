import { Router } from 'express';

import BaseController from '../controller/basecontroller';

import admin from './admin';
import community from './community';
import contact from './contact';
import faq from './faq';
import home from './home';
import howto from './howto';
import login from './login';
import mission from './mission';
import payment from './payment';
import profile from './profile';
import proof from './proof';
import signup from './signup';
import team from './team';
import terms from './terms';
import wishcards from './wishcards';

export const routes = Router();

const limiter = new BaseController().limiter;

routes.use('/admin', admin);
routes.use('/community', limiter, community);
routes.use('/contact', limiter, contact);
routes.use('/faq', faq);
routes.use('/', home);
routes.use('/howto', howto);
routes.use('/login', limiter, login);
routes.use('/mission', mission);
routes.use('/payment', limiter, payment);
routes.use('/profile', limiter, profile);
routes.use('/proof', proof);
routes.use('/signup', limiter, signup);
routes.use('/team', team);
routes.use('/terms', terms);
routes.use('/wishcards', limiter, wishcards);
