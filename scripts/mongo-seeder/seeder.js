const path = require('node:path');

require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const mongoose = require('mongoose');

const MongooseConnection = require('../../dist/db/connection').default;
const Agency = require('../../dist/db/models/Agency').default;
const Contact = require('../../dist/db/models/Contact').default;
const Donation = require('../../dist/db/models/Donation').default;
const Message = require('../../dist/db/models/Message').default;
const Post = require('../../dist/db/models/Post').default;
const User = require('../../dist/db/models/User').default;
const WishCard = require('../../dist/db/models/WishCard').default;
const log = require('../../dist/helper/logger').default;

(async () => {
	const mongooseConnection = new MongooseConnection();
	try {
		if (process.env.NODE_ENV === 'development') {
			mongooseConnection.connect();

			const addAgencies = async () => {
				const agenciesData = require('./data/agencies.json');

				log.info('Adding agencies to database...');
				await Agency.insertMany(
					agenciesData.map((agency) => ({
						...agency,
						_id: mongoose.Types.ObjectId(agency._id.$oid),
						joined: new Date(agency.joined.$date),
						accountManager: agency.accountManager
							? mongoose.Types.ObjectId(agency.accountManager.$oid)
							: null,
					})),
				);
			};

			const addContacts = async () => {
				const contactsData = require('./data/contacts.json');

				log.info('Adding contacts to database...');
				await Contact.insertMany(
					contactsData.map((contact) => ({
						...contact,
						_id: mongoose.Types.ObjectId(contact._id.$oid),
						sentDate: new Date(contact.sentDate.$date),
					})),
				);
			};

			const addDonations = async () => {
				const donationsData = require('./data/donations.json');

				log.info('Adding donations to database...');
				await Donation.insertMany(
					donationsData.map((donation) => ({
						...donation,
						_id: mongoose.Types.ObjectId(donation._id.$oid),
						donationTo: mongoose.Types.ObjectId(donation.donationTo.$oid),
						donationDate: new Date(donation.donationDate.$date),
						donationFrom: donation.donationFrom
							? mongoose.Types.ObjectId(donation.donationFrom.$oid)
							: null,
						donationCard: donation.donationCard
							? mongoose.Types.ObjectId(donation.donationCard.$oid)
							: null,
					})),
				);
			};

			const addMessages = async () => {
				const messagesData = require('./data/messages.json');

				log.info('Adding messages to database...');
				await Message.insertMany(
					messagesData.map((message) => ({
						...message,
						_id: mongoose.Types.ObjectId(message._id.$oid),
						messageFrom: mongoose.Types.ObjectId(message.messageFrom.$oid),
						messageTo: mongoose.Types.ObjectId(message.messageTo.$oid),
						createdAt: new Date(message.createdAt.$date),
					})),
				);
			};

			const addPosts = async () => {
				const postsData = require('./data/posts.json');

				log.info('Adding posts to database...');
				await Post.insertMany(
					postsData.map((post) => ({
						...post,
						_id: mongoose.Types.ObjectId(post._id.$oid),
						belongsTo: mongoose.Types.ObjectId(post.belongsTo.$oid),
						createdAt: new Date(post.createdAt.$date),
					})),
				);
			};

			const addUsers = async () => {
				const usersData = require('./data/users.json');

				log.info('Adding users to database...');
				await User.insertMany(
					usersData.map((user) => ({
						...user,
						_id: mongoose.Types.ObjectId(user._id.$oid),
						joined: new Date(user.joined.$date),
						passwordResetTokenExpires: user.passwordResetTokenExpires
							? new Date(user.passwordResetTokenExpires.$date)
							: null,
					})),
				);
			};

			const addWishCards = async () => {
				const wishCardsData = require('./data/wishcards.json');

				log.info('Adding wish cards to database...');
				await WishCard.insertMany(
					wishCardsData.map((wishCard) => ({
						...wishCard,
						_id: mongoose.Types.ObjectId(wishCard._id.$oid),
						childBirthday:
							wishCard.childBirthday &&
							typeof wishCard.childBirthday.$date === 'string'
								? new Date(wishCard.childBirthday.$date)
								: null,
						createdBy: mongoose.Types.ObjectId(wishCard.createdBy.$oid),
						deliveryDate: wishCard.deliveryDate
							? new Date(wishCard.deliveryDate.$date)
							: null,
						createdAt: new Date(wishCard.createdAt.$date),
						belongsTo: wishCard.belongsTo
							? mongoose.Types.ObjectId(wishCard.belongsTo.$oid)
							: null,
						messages: wishCard.messages
							? wishCard.messages.map((message) =>
									mongoose.Types.ObjectId(message.$oid),
							  )
							: null,
						isLockedBy: wishCard.isLockedBy
							? mongoose.Types.ObjectId(wishCard.isLockedBy.$oid)
							: null,
						isLockedUntil: wishCard.isLockedUntil
							? new Date(wishCard.isLockedUntil.$date)
							: null,
						status: Math.random() >= 0.5 ? 'donated' : 'published',
					})),
				);
			};

			const deleteDataAndImport = async () => {
				await Agency.deleteMany();
				await Contact.deleteMany();
				await Donation.deleteMany();
				await Message.deleteMany();
				await Post.deleteMany();
				await User.deleteMany();
				await WishCard.deleteMany();

				await addAgencies();
				await addContacts();
				await addDonations();
				await addMessages();
				await addPosts();
				await addUsers();
				await addWishCards();
			};

			await deleteDataAndImport();

			await mongooseConnection.disconnect();
		}
	} catch (error) {
		log.error(error);
		await mongooseConnection.disconnect();
	}
})();
