const mongoose = require('mongoose');
const BaseHandler = require('../handler/basehandler');
const log = require('../helper/logger');

class MongooseConnection extends BaseHandler {
	#mongoose;

	constructor(options = {}) {
		super();
		this.mongoose = mongoose;

		this.options = {
			...options,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
	}

	connect() {
		this.mongoose.Promise = Promise;
		this.mongoose.connect(process.env.MONGO_URI, this.options, (err, database) => {
			if (err) {
				this.log.error('Unable to connect to DB. Error:', err);
			} else {
				if (process.env.NODE_ENV !== 'test') {
					require('./changeHandler/WishcardChangeHandler');
				}
				this.log.info(
					`Connected to Mongodb ${
						database.name ? database.name : database.connections[0].name
					}`,
					{
						type: 'mongo_startup',
					},
				);
			}
		});
	}

	async disconnect() {
		try {
			await mongoose.disconnect();
		} catch (error) {
			this.log.error('failed to disconnect mongoose: ', error);
		} finally {
			process.exit(1);
		}
	}
}

function connect() {
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	mongoose.Promise = Promise;
	mongoose.connect(process.env.MONGO_URI, options, (err, database) => {
		if (err) {
			log.error('Unable to connect to DB. Error:', err);
		} else {
			if (process.env.NODE_ENV !== 'test') {
				require('./changeHandler/WishcardChangeHandler');
			}
			log.info(
				`Connected to Mongodb ${
					database.name ? database.name : database.connections[0].name
				}`,
				{
					type: 'mongo_startup',
				},
			);
		}
	});
}

async function disconnect() {
	try {
		await mongoose.disconnect();
	} catch (error) {
		log.error('failed to disconnect mongoose: ', error);
	} finally {
		process.exit(1);
	}
}

module.exports = { MongooseConnection, connect, disconnect };
