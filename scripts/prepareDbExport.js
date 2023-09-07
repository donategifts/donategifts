/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const randomNumber = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

(async () => {
	try {
		const prepareAgencies = () => {
			const agencies = require('./seeder-data/agencies.json');
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
			
			fs.writeFileSync(
				path.join(__dirname, './seeder-data/agencies.json'),
				JSON.stringify(agenciesData, null, 4),
				'utf8',
			);
            
            return agenciesData;
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
            const users = require('./seeder-data/users.json');
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
                }
            ];
            
            const userExists = (email) => {
                return users.some((user) => user.email === email);
            };
            
            // only add static users if they don't already exist
            const newStaticUsers = staticUsers.filter((staticUser) => !userExists(staticUser.email));
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
			
			fs.writeFileSync(
				path.join(__dirname, './seeder-data/users.json'),
				JSON.stringify(usersData, null, 4),
				'utf8',
			);
            
            return usersData;
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
