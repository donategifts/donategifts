/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const path = require('node:path');

const bcrypt = require('bcrypt');
const faker = require('faker');

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
					address1: faker.address.streetAddress(),
					address2: faker.address.secondaryAddress(),
					city: faker.address.city(),
					state: faker.address.state(),
					country: faker.address.country(),
					zipcode: faker.address.zipCode(),
				},
				agencyPhone: faker.phone.phoneNumber(),
				agencyEmail: faker.internet.email(),
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
				name: faker.name.findName(),
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
			const saltedPassword = await bcrypt.hash('Hello1234!', salt);
			
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
			
			const usersData = users.map((user) => {
				const {
					firstName = faker.name.firstName(),
					lastName = faker.name.lastName(),
					email = faker.internet.email(),
					bio = faker.lorem.paragraph(),
					loginMode = loginModeEnum.Email,
					emailVerified = true,
					role = userRoleEnum.Donor,
					password = saltedPassword,
				} = user;
				
				return {
					firstName,
					lastName,
					email,
					bio,
					loginMode,
					emailVerified,
					role,
					password,
				};
			});
			
			fs.writeFileSync(
				path.join(__dirname, './seeder-data/users.json'),
				JSON.stringify(usersData, null, 4),
				'utf8',
			);
		};
		
		const prepareWishCards = () => {
			const wishCardsData = wishCards.map((wishCard) => ({
				...wishCard,
				childFirstName: faker.name.firstName(),
				childLastName: faker.name.lastName(),
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
