/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const path = require('node:path');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const contacts = require('./seeder-data/contacts.json');
// const donations = require('./seeder-data/donations.json');
// const messages = require('./seeder-data/messages.json');
// const posts = require('./seeder-data/posts.json');
const users = require('./seeder-data/users.json');
const wishCards = require('./seeder-data/wishcards.json');

(async () => {
	try {
		const prepareAgencies = () => {
			const agencies = require('./seeder-data/agencies.json');
			const agenciesData = agencies.map((agency) => {
				const {
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
			
			fs.writeFileSync(
				path.join(__dirname, './seeder-data/agencies.json'),
				JSON.stringify(agenciesData, null, 4),
				'utf8',
			);
		};
		
		const prepareChildren = () => {
			const children = require('./seeder-data/children.json');
			const childrenData = children.map((child) => {
				const {
					firstName = faker.person.firstName(),
					lastName = faker.person.lastName(),
					birthYear = faker.date.past({ years: 10 }).getFullYear(),
					interest = faker.lorem.sentence(),
					story = faker.lorem.paragraph(),
					imageId = null,
					agencyId = null,
				} = child;
				
				return {
					firstName,
					lastName,
					birthYear,
					interest,
					story,
					imageId,
					agencyId,
				};
			});
			
			fs.writeFileSync(
				path.join(__dirname, './seeder-data/children.json'),
				JSON.stringify(childrenData, null, 4),
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
					firstName = faker.person.firstName(),
					lastName = faker.person.lastName(),
					email = faker.internet.email(),
					bio = faker.lorem.paragraph(),
					loginMode = loginModeEnum.Email,
					emailVerified = true,
					role = userRoleEnum.Donor,
					password = saltedPassword,
					imageId = null,
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
					imageId,
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
			prepareChildren();
			// prepareContacts();
			// prepareDonations();
			// prepareMessages();
			// preparePosts();
			prepareUsers();
			// prepareWishCards();
		};

		run();
	} catch (error) {
		console.error(error);
	}
})();
