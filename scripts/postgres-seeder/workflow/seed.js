const path = require('node:path');

require('dotenv').config({ path: path.join(path.resolve(), '../../config.env') });

const { database } = require('../../../dist/db/postgresconnection');
const { importSeederFile } = require('../utils');

const purgeDatabase = async () => {
	await database.transaction().execute(async (trx) => {
		// must be deleted in this order to prevent foreign key constraint errors
		await trx.deleteFrom('verification_tokens').execute();
		await trx.deleteFrom('community_posts').execute();
		await trx.deleteFrom('messages').execute();
		await trx.deleteFrom('orders').execute();
		await trx.deleteFrom('wishcards').execute();
		await trx.deleteFrom('items').execute();
		await trx.deleteFrom('children').execute();
		await trx.deleteFrom('agencies').execute();
		await trx.deleteFrom('images').execute();
		await trx.deleteFrom('users').execute();
	});
};

const seedUsers = async (trx, options = { withImages: false }) => {
	const data = await importSeederFile('users');

	const formattedData = data.map((user) => {
		const {
			id,
			first_name,
			last_name,
			email,
			password,
			role,
			login_mode,
			bio,
			is_verified,
			is_disabled,
			image_id,
		} = user;

		return {
			id,
			first_name,
			last_name,
			email,
			password,
			role,
			login_mode,
			bio,
			is_verified,
			is_disabled,
			image_id: options.withImages ? image_id : null,
		};
	});

	if (options.withImages) {
		const results = [];
		formattedData.forEach(async (user, _index) => {
			const userWithImage = await trx
				.updateTable('users')
				.set({
					image_id: user.image_id,
				})
				.where('id', '=', user.id)
				.execute();

			results.push(userWithImage);
		});

		const usersWithImages = results.map((row) => {
			const { id, role } = row;

			return {
				id,
				role,
			};
		});

		return usersWithImages;
	}

	const result =
		!options.withImages &&
		(await trx.insertInto('users').values(formattedData).returning(['id', 'role']).execute());

	const users = result.map((row) => {
		const { id, role } = row;

		return {
			id,
			role,
		};
	});

	return users;
};

const seedAgencies = async (trx) => {
	const data = await importSeederFile('agencies');

	const formattedData = data.map((agency) => {
		const {
			id,
			name,
			website,
			phone,
			bio,
			address_line_1,
			address_line_2,
			city,
			state,
			country_code,
			zip_code,
			is_verified,
			employer_identification_number,
			account_manager_id,
			image_id,
		} = agency;

		return {
			id,
			name,
			website,
			phone,
			bio,
			address_line_1,
			address_line_2,
			city,
			state,
			country_code,
			zip_code,
			is_verified,
			employer_identification_number,
			account_manager_id,
			image_id,
		};
	});

	const result = await trx
		.insertInto('agencies')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const agencies = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return agencies;
};

const seedChildren = async (trx) => {
	const data = await importSeederFile('children');

	const formattedData = data.map((child) => {
		const { id, name, birth_year, interest, story, image_id, agency_id } = child;

		return {
			id,
			name,
			birth_year,
			interest,
			story,
			image_id,
			agency_id,
		};
	});

	const result = await trx
		.insertInto('children')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const children = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return children;
};

const seedCommunityPosts = async (trx) => {
	const data = await importSeederFile('community_posts');

	const formattedData = data.map((communityPost) => {
		const { id, message, agency_id, image_id } = communityPost;

		return {
			id,
			message,
			agency_id,
			image_id,
		};
	});

	const result = await trx
		.insertInto('community_posts')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const communityPosts = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return communityPosts;
};

const seedItems = async (trx) => {
	const data = await importSeederFile('items');

	const formattedData = data.map((item) => {
		const { id, name, price, link, retailer_name, retailer_product_id, meta_data, image_id } =
			item;

		return {
			id,
			name,
			price,
			link,
			retailer_name,
			retailer_product_id,
			meta_data,
			image_id,
		};
	});

	const result = await trx.insertInto('items').values(formattedData).returning(['id']).execute();

	const items = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return items;
};

const seedMessages = async (trx) => {
	const data = await importSeederFile('messages');

	const formattedData = data.map((message) => {
		const { id, content, sender_id, wishcard_id } = message;

		return {
			id,
			content,
			sender_id,
			wishcard_id,
		};
	});

	const result = await trx
		.insertInto('messages')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const messages = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return messages;
};

const seedOrders = async (trx) => {
	const data = await importSeederFile('orders');

	const formattedData = data.map((order) => {
		const { id, status, delivery_date, tracking_info, donor_id, wishcard_id } = order;

		return {
			id,
			status,
			delivery_date,
			tracking_info,
			donor_id,
			wishcard_id,
		};
	});

	const result = await trx.insertInto('orders').values(formattedData).returning(['id']).execute();

	const orders = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return orders;
};

const seedVerificationTokens = async (trx) => {
	const data = await importSeederFile('verification_tokens');

	const formattedData = data.map((verificationToken) => {
		const { id, token, type, user_id, expires_at } = verificationToken;

		return {
			id,
			token,
			type,
			user_id,
			expires_at,
		};
	});

	const result = await trx
		.insertInto('verification_tokens')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const verificationTokens = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return verificationTokens;
};

const seedWishcards = async (trx) => {
	const data = await importSeederFile('wishcards');

	const formattedData = data.map((wishcard) => {
		const {
			id,
			address_line_1,
			address_line_2,
			city,
			state,
			country_code,
			zip_code,
			status,
			child_id,
			item_id,
			image_id,
			created_by,
		} = wishcard;

		return {
			id,
			address_line_1,
			address_line_2,
			city,
			state,
			country_code,
			zip_code,
			status,
			child_id,
			item_id,
			image_id,
			created_by,
		};
	});

	const result = await trx
		.insertInto('wishcards')
		.values(formattedData)
		.returning(['id'])
		.execute();

	const wishcards = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return wishcards;
};

const seedImages = async (trx) => {
	const data = await importSeederFile('images');

	const formattedData = data.map((image) => {
		const { id, url, meta_data, created_by } = image;

		return {
			id,
			url,
			meta_data,
			created_by,
		};
	});

	const result = await trx.insertInto('images').values(formattedData).returning(['id']).execute();

	const images = result.map((row) => {
		const { id } = row;

		return {
			id,
		};
	});

	return images;
};

const seedDatabase = async () => {
	const {
		agencies,
		children,
		users,
		communityPosts,
		items,
		wishcards,
		messages,
		orders,
		verificationTokens,
		images,
	} = await database.transaction().execute(async (trx) => {
		const users = await seedUsers(trx);
		const images = await seedImages(trx);
		// const usersWithImages = await seedUsers(trx, { withImages: true });
		const agencies = await seedAgencies(trx);
		const children = await seedChildren(trx);
		const communityPosts = await seedCommunityPosts(trx);
		const items = await seedItems(trx);
		const wishcards = await seedWishcards(trx);
		const messages = await seedMessages(trx);
		const orders = await seedOrders(trx);
		const verificationTokens = await seedVerificationTokens(trx);

		return {
			users,
			agencies,
			children,
			communityPosts,
			items,
			wishcards,
			messages,
			orders,
			verificationTokens,
			images,
		};
	});

	return {
		agencies,
		children,
		users,
		communityPosts,
		items,
		wishcards,
		messages,
		orders,
		verificationTokens,
		images,
	};
};

module.exports = {
	purgeDatabase,
	seedDatabase,
};
