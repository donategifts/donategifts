const { randomUUID } = require('node:crypto');

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const { importSeederFile, saveSeederFile } = require('../utils');

const generateAgencies = async () => {
	const agencies = await importSeederFile('agencies');
	const agenciesData = agencies.map((agency) => {
		const {
			id = randomUUID(),
			name = faker.company.name(),
			address_line_1 = faker.location.streetAddress(),
			address_line_2 = faker.location.secondaryAddress(),
			city = faker.location.city(),
			state = faker.location.state(),
			country_code = 'US',
			zip_code = faker.location.zipCode(),
			phone = faker.phone.number(),
			email = faker.internet.email(),
			bio = faker.lorem.paragraph(),
			is_verified = true,
			employer_identification_number = faker.number.int(),
			website = faker.internet.url(),
			account_manager_id = null,
			image_id = null,
		} = agency;

		return {
			id,
			name,
			address_line_1,
			address_line_2,
			city,
			state,
			country_code,
			zip_code,
			phone,
			email,
			bio,
			is_verified,
			employer_identification_number,
			website,
			account_manager_id,
			image_id,
		};
	});

	await saveSeederFile('agencies', agenciesData);
	return agenciesData;
};

const generateChildren = async () => {
	const children = await importSeederFile('children');
	const childrenData = children.map((child) => {
		const {
			id = randomUUID(),
			name = faker.person.firstName(),
			birth_year = faker.date.past({ years: 15 }).getFullYear(),
			interest = faker.lorem.sentence(),
			story = faker.lorem.paragraph(),
			image_id = null,
			agency_id = null,
		} = child;

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

	await saveSeederFile('children', childrenData);
	return childrenData;
};

const generateCommunityPosts = async () => {
	const communityPosts = await importSeederFile('community_posts');
	const communityPostsData = communityPosts.map((communityPost) => {
		const {
			id = randomUUID(),
			message = faker.lorem.sentence(),
			agency_id = null,
			image_id = null,
		} = communityPost;

		return {
			id,
			message,
			agency_id,
			image_id,
		};
	});

	await saveSeederFile('community_posts', communityPostsData);
	return communityPostsData;
};

const generateUsers = async () => {
	const users = await importSeederFile('users');
	const saltedPassword = await bcrypt.hash('Test123!', 10);

	const loginModeEnum = {
		Email: 'email',
		Google: 'google',
		Facebook: 'facebook',
	};

	const userRoleEnum = {
		Admin: 'admin',
		Donor: 'donor',
		Partner: 'partner',
	};

	const staticUsers = [
		{
			first_name: 'Admin',
			last_name: 'User',
			email: 'admin@donate-gifts.com',
			password: saltedPassword,
			role: userRoleEnum.Admin,
			login_mode: loginModeEnum.Email,
		},
		{
			first_name: 'Donor',
			last_name: 'User',
			email: 'donor@donate-gifts.com',
			password: saltedPassword,
			role: userRoleEnum.Donor,
			login_mode: loginModeEnum.Email,
		},
		{
			first_name: 'Partner',
			last_name: 'User',
			email: 'partner@donate-gifts.com',
			password: saltedPassword,
			role: userRoleEnum.Partner,
			login_mode: loginModeEnum.Email,
		},
	];

	// only add static users if they don't already exist
	const newStaticUsers = staticUsers.filter(
		(staticUser) => !users.some((user) => user.email === staticUser.email),
	);

	users.push(...newStaticUsers);

	const usersData = users.map((user) => {
		const {
			id = randomUUID(),
			first_name = faker.person.firstName(),
			last_name = faker.person.lastName(),
			email = faker.internet.email(),
			password = saltedPassword,
			role = userRoleEnum.Donor,
			login_mode = loginModeEnum.Email,
			bio = faker.lorem.paragraph(),
			is_verified = true,
			image_id = null,
		} = user;

		return {
			id,
			first_name,
			last_name,
			email,
			bio,
			login_mode,
			is_verified,
			role,
			password,
			image_id,
		};
	});

	await saveSeederFile('users', usersData);
	return usersData;
};

const generateItems = async () => {
	const items = await importSeederFile('items');
	const itemsData = items.map((item) => {
		const {
			id = randomUUID(),
			name = faker.commerce.productName(),
			price = faker.commerce.price(),
			link = faker.internet.url(),
			retailer_name = faker.company.name(),
			retailer_product_id = randomUUID().toString().split('-')[0],
			meta_data = {},
			image_id = null,
		} = item;

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

	await saveSeederFile('items', itemsData);
	return itemsData;
};

const generateMessages = async () => {
	const messages = await importSeederFile('messages');
	const messagesData = messages.map((message) => {
		const {
			id = randomUUID(),
			content = faker.lorem.sentence(),
			sender_id = null,
			wishcard_id = null,
		} = message;

		return {
			id,
			content,
			sender_id,
			wishcard_id,
		};
	});

	await saveSeederFile('messages', messagesData);
	return messagesData;
};

const generateOrders = async () => {
	const orders = await importSeederFile('orders');
	const ordersData = orders.map((order) => {
		const {
			id = randomUUID(),
			status = 'pending',
			delivery_date = null,
			tracking_info = null,
			donor_id = null,
			wishcard_id = null,
		} = order;

		return {
			id,
			status,
			delivery_date,
			tracking_info,
			donor_id,
			wishcard_id,
		};
	});

	await saveSeederFile('orders', ordersData);
	return ordersData;
};

const generateVerificationTokens = async () => {
	const verificationTokens = await importSeederFile('verification_tokens');
	const verificationTokensData = verificationTokens.map((verificationToken) => {
		const {
			id = randomUUID(),
			token = randomUUID().split('-').join(''),
			type = 'email',
			expires_at = faker.date.future().toISOString(),
			user_id = null,
		} = verificationToken;

		return {
			id,
			token,
			type,
			expires_at,
			user_id,
		};
	});

	await saveSeederFile('verification_tokens', verificationTokensData);
	return verificationTokensData;
};

const generateWishcards = async () => {
	const wishcards = await importSeederFile('wishcards');
	const wishcardsData = wishcards.map((wishcard) => {
		const {
			id = randomUUID(),
			address_line_1 = faker.location.streetAddress(),
			address_line_2 = faker.location.secondaryAddress(),
			city = faker.location.city(),
			state = faker.location.state(),
			country_code = 'US',
			zip_code = faker.location.zipCode(),
			status = 'draft',
			child_id = null,
			item_id = null,
			image_id = null,
			created_by = null,
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

	await saveSeederFile('wishcards', wishcardsData);
	return wishcardsData;
};

const generateImages = async () => {
	const images = await importSeederFile('images');
	const imagesData = images.map((image) => {
		const {
			id = randomUUID(),
			url = faker.image.urlPicsumPhotos(),
			meta_data = {},
			created_by = null,
		} = image;

		return {
			id,
			url,
			meta_data,
			created_by,
		};
	});

	await saveSeederFile('images', imagesData);
	return imagesData;
};

module.exports = {
	generateAgencies,
	generateChildren,
	generateCommunityPosts,
	generateUsers,
	generateItems,
	generateMessages,
	generateOrders,
	generateVerificationTokens,
	generateWishcards,
	generateImages,
};
