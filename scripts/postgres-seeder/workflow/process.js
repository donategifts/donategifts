const { importSeederFile, saveSeederFile, randomNumber } = require('../utils');

const processAgencies = async () => {
	const agencies = await importSeederFile('agencies');
	const users = await importSeederFile('users');
	const images = await importSeederFile('images');

	const partnerUsers = users.filter((user) => user.role === 'partner');

	const agenciesWithAccountManagers = agencies.reduce((acc, agency) => {
		const hasValidUser =
			agency.account_manager_id &&
			users.some((user) => user.id === agency.account_manager_id);
		const hasValidImage =
			agency.image_id && images.some((image) => image.id === agency.image_id);

		const randomPartnerUserIndex = randomNumber(0, partnerUsers.length - 1);
		const randomPartnerUserId = partnerUsers[randomPartnerUserIndex].id || null;

		const randomImageIndex = randomNumber(0, images.length - 1);
		const randomImageId = images[randomImageIndex].id || null;

		acc.push({
			...agency,
			...(!hasValidUser && { account_manager_id: randomPartnerUserId }),
			...(!hasValidImage && { image_id: randomImageId }),
		});

		return acc;
	}, []);

	await saveSeederFile('agencies', agenciesWithAccountManagers);
};

const processChildren = async () => {
	const children = await importSeederFile('children');
	const agencies = await importSeederFile('agencies');
	const images = await importSeederFile('images');

	const childrenWithAgencies = children.reduce((acc, child) => {
		const hasValidAgency =
			child.agency_id && agencies.some((agency) => agency.id === child.agency_id);
		const hasValidImage = child.image_id && images.some((image) => image.id === child.image_id);

		const randomAgencyIndex = randomNumber(0, agencies.length - 1);
		const randomAgencyId = agencies[randomAgencyIndex].id || null;

		const randomImageIndex = randomNumber(0, images.length - 1);
		const randomImageId = images[randomImageIndex].id || null;

		acc.push({
			...child,
			...(!hasValidAgency && { agency_id: randomAgencyId }),
			...(!hasValidImage && { image_id: randomImageId }),
		});

		return acc;
	}, []);

	await saveSeederFile('children', childrenWithAgencies);
};

const processCommunityPosts = async () => {
	const communityPosts = await importSeederFile('community_posts');
	const agencies = await importSeederFile('agencies');
	const images = await importSeederFile('images');

	const communityPostsWithAgencies = communityPosts.reduce((acc, communityPost) => {
		const hasValidAgency =
			communityPost.agency_id &&
			agencies.some((agency) => agency.id === communityPost.agency_id);
		const hasValidImage =
			communityPost.image_id && images.some((image) => image.id === communityPost.image_id);

		const randomAgencyIndex = randomNumber(0, agencies.length - 1);
		const randomAgencyId = agencies[randomAgencyIndex].id || null;

		const randomImageIndex = randomNumber(0, images.length - 1);
		const randomImageId = images[randomImageIndex].id || null;

		acc.push({
			...communityPost,
			...(!hasValidAgency && { agency_id: randomAgencyId }),
			...(!hasValidImage && { image_id: randomImageId }),
		});

		return acc;
	}, []);

	await saveSeederFile('community_posts', communityPostsWithAgencies);
};

const processUsers = async () => {
	const users = await importSeederFile('users');
	const images = await importSeederFile('images');

	const processedUsers = users.reduce((acc, user) => {
		const hasValidImage = user.image_id && images.some((image) => image.id === user.image_id);

		const randomImageIndex = randomNumber(0, images.length - 1);
		const randomImageId = images[randomImageIndex].id || null;

		acc.push({
			...user,
			...(!hasValidImage && { image_id: randomImageId }),
		});

		return acc;
	}, []);

	await saveSeederFile('users', processedUsers);
};

const processMessages = async () => {
	const messages = await importSeederFile('messages');
	const users = await importSeederFile('users');
	const wishcards = await importSeederFile('wishcards');

	const processedMessages = messages.reduce((acc, message) => {
		const hasValidUser =
			message.sender_id && users.some((user) => user.id === message.sender_id);
		const hasValidWishcard =
			message.wishcard_id &&
			wishcards.some((wishcard) => wishcard.id === message.wishcard_id);

		if (hasValidUser && hasValidWishcard) {
			acc.push(message);
			return acc;
		}

		const randomUserIndex = randomNumber(0, users.length - 1);
		const randomUserId = users[randomUserIndex].id || null;

		const randomWishcardIndex = randomNumber(0, wishcards.length - 1);
		const randomWishcardId = wishcards[randomWishcardIndex].id || null;

		acc.push({
			...message,
			...(!hasValidUser && { sender_id: randomUserId }),
			...(!hasValidWishcard && { wishcard_id: randomWishcardId }),
		});

		return acc;
	}, []);

	await saveSeederFile('messages', processedMessages);
};

const processOrders = async () => {
	const orders = await importSeederFile('orders');
	const users = await importSeederFile('users');
	const wishcards = await importSeederFile('wishcards');

	const processedOrders = orders.reduce((acc, order) => {
		const hasValidUser = order.donor_id && users.some((user) => user.id === order.donor_id);
		const hasValidWishcard =
			order.wishcard_id && wishcards.some((wishcard) => wishcard.id === order.wishcard_id);

		const randomUserIndex = randomNumber(0, users.length - 1);
		const randomUserId = users[randomUserIndex].id || null;

		const randomWishcardIndex = randomNumber(0, wishcards.length - 1);
		const randomWishcardId = wishcards[randomWishcardIndex].id || null;

		acc.push({
			...order,
			...(!hasValidUser && { donor_id: randomUserId }),
			...(!hasValidWishcard && { wishcard_id: randomWishcardId }),
		});

		return acc;
	}, []);

	await saveSeederFile('orders', processedOrders);
};

const processVerificationTokens = async () => {
	const verificationTokens = await importSeederFile('verification_tokens');
	const users = await importSeederFile('users');

	const processedVerificationTokens = verificationTokens.reduce(
		(acc, verificationToken, _index) => {
			const hasValidUser =
				verificationToken.user_id &&
				users.some((user) => user.id === verificationToken.user_id);

			const randomUserIndex = randomNumber(0, users.length - 1);
			const randomUserId = users[randomUserIndex].id || null;

			acc.push({
				...verificationToken,
				...(!hasValidUser && { user_id: randomUserId }),
			});

			return acc;
		},
		[],
	);

	await saveSeederFile('verification_tokens', processedVerificationTokens);
};

const processWishcards = async () => {
	const wishcards = await importSeederFile('wishcards');
	const children = await importSeederFile('children');
	const items = await importSeederFile('items');
	const users = await importSeederFile('users');
	const images = await importSeederFile('images');

	const agencyUsers = users.filter((user) => user.role === 'partner');

	const processedWishcards = wishcards.reduce((acc, wishcard) => {
		const hasValidChild =
			wishcard.child_id && children.some((child) => child.id === wishcard.child_id);
		const hasValidItem = wishcard.item_id && items.some((item) => item.id === wishcard.item_id);
		const hasValidUser =
			wishcard.created_by && agencyUsers.some((user) => user.id === wishcard.created_by);
		const hasValidImage =
			wishcard.image_id && images.some((image) => image.id === wishcard.image_id);

		const randomChildIndex = randomNumber(0, children.length - 1);
		const randomChildId = children[randomChildIndex].id || null;

		const randomItemIndex = randomNumber(0, items.length - 1);
		const randomItemId = items[randomItemIndex].id || null;

		const randomUserIndex = randomNumber(0, agencyUsers.length - 1);
		const randomUserId = agencyUsers[randomUserIndex].id || null;

		const randomImageIndex = randomNumber(0, images.length - 1);
		const randomImageId = images[randomImageIndex].id || null;

		acc.push({
			...wishcard,
			...(!hasValidChild && { child_id: randomChildId }),
			...(!hasValidItem && { item_id: randomItemId }),
			...(!hasValidUser && { created_by: randomUserId }),
			...(!hasValidImage && { image_id: randomImageId }),
		});

		return acc;
	}, []);

	await saveSeederFile('wishcards', processedWishcards);
};

const processImages = async () => {
	const images = await importSeederFile('images');
	const users = await importSeederFile('users');

	const processedImages = images.reduce((acc, image) => {
		const hasValidUser = image.created_by && users.some((user) => user.id === image.created_by);

		const randomUserIndex = randomNumber(0, users.length - 1);
		const randomUserId = users[randomUserIndex].id || null;

		acc.push({
			...image,
			...(!hasValidUser && { created_by: randomUserId }),
		});

		return acc;
	}, []);

	await saveSeederFile('images', processedImages);
};

module.exports = {
	processAgencies,
	processChildren,
	processCommunityPosts,
	processUsers,
	processMessages,
	processOrders,
	processVerificationTokens,
	processWishcards,
	processImages,
};
