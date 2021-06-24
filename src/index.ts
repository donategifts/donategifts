import { logger } from './helper/logger';
import { boot } from './server';

boot().catch((error) => logger.error(error));
