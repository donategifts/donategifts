import { Router } from 'express';

import agency from './agency';
import community from './community';
import wishcards from './wishcards';

export const routes = Router();

routes.use('/agency', agency);
routes.use('/community', community);
routes.use('/wishcards', wishcards);
