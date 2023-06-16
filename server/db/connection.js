const mongoose = require('mongoose');
const BaseController = require('../controller/basecontroller');

module.exports = class MongooseConnection extends BaseController {
	#mongoose;

	#options;

	constructor(options = {}) {
		super();
		this.#mongoose = mongoose;

		this.#options = {
			...options,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
	}

	connect() {
		this.#mongoose.Promise = Promise;
		this.#mongoose.set('strictQuery', false);
		this.#mongoose.connect(process.env.MONGO_URI, this.#options, (err, database) => {
			if (err) {
				this.log.error(err, 'Unable to connect to DB.');
			} else {
				if (process.env.NODE_ENV === 'production') {
					const WishCardRepository = require('./repository/WishCardRepository');
					new WishCardRepository().watch();
				}

				this.log.info(
					`Connected to Mongodb ${
						database.name ? database.name : database.connections[0].name
					}`,
				);
			}
		});
	}

	async disconnect() {
		try {
			await this.#mongoose.disconnect();
		} catch (error) {
			this.log.error(error, 'failed to disconnect mongoose');
		} finally {
			process.exit(1);
		}
	}
};
