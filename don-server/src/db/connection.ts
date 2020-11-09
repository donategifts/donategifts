import * as mongoose from 'mongoose';
import { logger } from '../helper/common';

export default class MongooseConnection {
  static async connect(): Promise<void> {
    const isInTest = process.env.NODE_ENV === 'test' && !process.env.ALLOW_MONGOOSE_TESTING;

    if (isInTest) {
      throw new Error(
        'MongooseConnection.connect has been called during a test, you should mock this call!',
      );
    }

    try {
      mongoose.set('useCreateIndex', true);

      mongoose.Model.on('index', (err) => {
        if (err) {
          logger.error('Mongoose create index error', err);
        }
      });

      // When successfully connected
      mongoose.connection.on('connected', () => {
        logger.info('Mongoose default connection open');
      });

      // When destroyed
      mongoose.connection.on('destroy', () => {
        logger.info('Mongoose default connection destroyed');
      });

      // When successfully connected
      mongoose.connection.on('reconnected', () => {
        logger.info('Mongoose default connection reconnected');
      });

      // If the connection throws an error
      mongoose.connection.on('error', (err) => {
        logger.info(`Mongoose default connection error: ${err}`);
      });

      // If the connection throws an error
      mongoose.connection.on('index', (err) => {
        if (err) {
          logger.error(`Mongoose indexing error: ${err}`);
        }
      });

      // When the connection is disconnected
      mongoose.connection.on('disconnected', () => {
        logger.info('Mongoose default connection disconnected');
      });

      await mongoose.connect(String(process.env.MONGO_URI), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    } catch (error) {
      throw new Error(`Something went horrible wrong with Mongoose: ${error}`);
    }
  }
}
