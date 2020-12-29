const path = require('path');
const { allUsers, wishcards, agency } = require('./seederData');
const User = require('./models/User');
const WishCard = require('./models/WishCard');
const Agency = require('./models/Agency');
const Message = require('./models/Message');
const Donation = require('./models/Donation');
const { getMessageChoices } = require('../utils/defaultMessages');

const MongooseConnection = require('./connection');

require('dotenv').config({ path: path.resolve(__dirname, '../../services/config/config.env') });

if (process.env.NODE_ENV === 'development') {
	MongooseConnection.connect();

	const createWishCard = async (partnerId, createdAgency, card) => {
		await WishCard.create({
			...card,
			childFirstName: `${card.childFirstName}-${card.status}-${card.createdAt.toDateString()}`,
			createdBy: partnerId,
			belongsTo: createdAgency._id,
		});
	};

	const createDonation = async (donorId, agencyId, card) => {
		const statusChoices = ['confirmed', 'ordered', 'delivered'];
		// eslint-disable-next-line no-bitwise
		const newStatus = statusChoices[(statusChoices.length * Math.random()) | 0];
		await Donation.create({
			donationFrom: donorId,
			donationTo: agencyId,
			donationCard: card._id,
			donationPrice: card.wishItemPrice,

			status: newStatus,
		});
	};

	const createMessage = async (donor, card) => {
		const allMessages = getMessageChoices(donor.fName, card.childFirstName);
		// eslint-disable-next-line no-bitwise
		const message = allMessages[(allMessages.length * Math.random()) | 0];
		await Message.create({
			messageFrom: donor._id,
			messageTo: card._id,
			// eslint-disable-next-line no-undef
			message,
		});
	};

	const createRecords = async () => {
		try {
			const { donorUser, partnerUser, adminUser } = allUsers;
			await User.insertMany([adminUser, partnerUser]);
			const donor = await User.create(donorUser);
			const partnerUserId = await User.findOne({ email: partnerUser.email })
				.select('_id')
				.lean()
				.exec();
			const createdAgency = await Agency.create({
				...agency,
				accountManager: partnerUserId,
			});
			await Promise.all(
				wishcards.map(async (card) => {
					await createWishCard(partnerUserId, createdAgency, card);
				}),
			);
			const donatedCards = await WishCard.find({ status: 'donated' });
			await Promise.all(
				donatedCards.map(async (donatedCard) => {
					await createDonation(donor._id, createdAgency, donatedCard);
				}),
			);

			const allCards = await WishCard.find({});
			await Promise.all(
				allCards.map(async (card) => {
					await createMessage(donor, card);
				}),
			);
		} catch (error) {
			process.exit(1);
		}
	};

	const insertData = async () => {
		try {
			await createRecords();
		} catch (error) {
			process.exit(1);
		}
	};

	const deleteDataAndImport = async () => {
		try {
			await Agency.deleteMany();
			await User.deleteMany();
			await WishCard.deleteMany();
			await Message.deleteMany();
			await Donation.deleteMany();

			await createRecords();
			process.exit();
		} catch (error) {
			process.exit(1);
		}
	};

	const destroyData = async () => {
		try {
			await Agency.deleteMany();
			await User.deleteMany();
			await WishCard.deleteMany();
			await Message.deleteMany();
			await Donation.deleteMany();

			process.exit();
		} catch (error) {
			process.exit(1);
		}
	};
	if (process.argv[2] === '-d') {
		(async () => {
			await destroyData();
		})();
	} else if (process.argv[2] === '-i') {
		(async () => {
			await insertData();
		})();
	} else {
		(async () => {
			await deleteDataAndImport();
		})();
	}
} else {
	process.exit();
}
