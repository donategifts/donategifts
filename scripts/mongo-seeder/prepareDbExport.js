/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const path = require('node:path');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const agencies = require('./seeder-data/agencies.json');
const contacts = require('./seeder-data/contacts.json');
// const donations = require('./seeder-data/donations.json');
// const messages = require('./seeder-data/messages.json');
// const posts = require('./seeder-data/posts.json');
const users = require('./seeder-data/users.json');
const wishCards = require('./seeder-data/wishcards.json');

(async () => {
	try {
		const prepareAgencies = () => {
			const agenciesData = agencies.map((agency) => ({
				...agency,
				agencyAddress: {
					address1: faker.location.streetAddress(),
					address2: faker.location.streetAddress(),
					city: faker.location.city(),
					state: faker.location.state(),
					country: faker.location.country(),
					zipcode: faker.location.zipCode(),
				},
				agencyPhone: faker.phone.number(),
			}));

			fs.writeFileSync(
				path.join(__dirname, './seeder-data/agencies.json'),
				JSON.stringify(agenciesData, null, 4),
				'utf8',
			);
		};

		const prepareContacts = () => {
			const contactsData = contacts.map((contact) => ({
				...contact,
				name: faker.person.fullName(),
				email: faker.internet.email(),
			}));

			fs.writeFileSync(
				path.join(__dirname, './seeder-data/contacts.json'),
				JSON.stringify(contactsData, null, 4),
				'utf8',
			);
		};

		const prepareDonations = () => {};

		const prepareMessages = () => {};

		const preparePosts = () => {};

		const prepareUsers = async () => {
			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash('Hello1234!', salt);

			const usersData = users.map((user) => ({
				...user,
				fName: faker.person.firstName(),
				lName: faker.person.lastName(),
				email: faker.internet.email(),
				password,
			}));

			fs.writeFileSync(
				path.join(__dirname, './seeder-data/users.json'),
				JSON.stringify(usersData, null, 4),
				'utf8',
			);
		};

		const prepareWishCards = () => {
			const wishCardsData = wishCards.map((wishCard) => ({
				...wishCard,
				childFirstName: faker.person.firstName(),
				childLastName: faker.person.lastName(),
				childStory: faker.lorem.paragraph(),
			}));

			fs.writeFileSync(
				path.join(__dirname, './seeder-data/wishcards.json'),
				JSON.stringify(wishCardsData, null, 4),
				'utf8',
			);
		};

		const run = () => {
			prepareAgencies();
			prepareContacts();
			prepareDonations();
			prepareMessages();
			preparePosts();
			prepareUsers();
			prepareWishCards();
		};

		run();
	} catch (error) {
		console.error(error);
	}
})();
