import mongoose, { ConnectOptions } from 'mongoose';

import BaseController from '../controller/basecontroller';
import config from '../helper/config';

export default class MongooseConnection extends BaseController {
	private mongoose: typeof mongoose;

	private options: ConnectOptions;

	constructor(options = {}) {
		super();
		this.mongoose = mongoose;

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
				const WishCardRepository = require('./repository/WishCardRepository');
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
