import * as dotenv from 'dotenv';

export const loadEnv = (): void => {
  dotenv.config();
  dotenv.config({ path: './default.env' });
};
