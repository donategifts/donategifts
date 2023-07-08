import { Router } from 'express';

import community from './community';

export const routes = Router();

routes.use('/community', community);
