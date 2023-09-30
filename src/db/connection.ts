import mongoose, { ConnectOptions } from 'mongoose';

import config from '../helper/config';
import logger from '../helper/logger';

export default class MongooseConnection {
	private mongoose: typeof mongoose;

	private options: ConnectOptions;

	private log: typeof logger;

	constructor(options = {}) {
		this.mongoose = mongoose;

		this.log = logger;

		this.options = {
			...options,
		};
	}

	async connect() {
		this.mongoose.Promise = Promise;
		this.mongoose.set('strictQuery', false);

		try {
			const result = await this.mongoose.connect(String(config.MONGO_URI), this.options);

			if (config.NODE_ENV === 'production') {
				const WishCardRepository = (await import('./repository/WishCardRepository'))
					.default;
				new WishCardRepository().watch();
			}

			this.log.info(`Connected to DB: ${result.connection.db.databaseName}`);
		} catch (error) {
			this.log.error('Failed to connect to DB:', error);
		}
	}

	async disconnect() {
		try {
			this.log.info('Disconnecting mongoose');
			await this.mongoose.disconnect();
		} catch (error) {
			this.log.error('Failed to disconnect mongoose:', error);
		} finally {
			process.exit(1);
		}
	}
}
