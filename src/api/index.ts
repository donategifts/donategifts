import { Router } from 'express';

import community from './community';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/community', community);
routes.use('/wishcards', wishcards);
