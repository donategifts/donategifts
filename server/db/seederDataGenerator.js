const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const bcrypt = require('bcrypt');
const fs = require('fs');

const User = require('./models/User');

require('dotenv').config({ path: path.resolve(__dirname, '../../config/config.env') });

const log = require('../helper/logger');

async function generateUsers(donorAmount = 10, partnerAmount = 4, adminAmount = 2) {
	const donors = [];
	const partners = [];
	const admins = [];
	const users = [];
	const userCredentials = {};

	let donorCounter = donorAmount;
	let partnerCounter = partnerAmount;
	let adminCounter = adminAmount;

	const totalAmount = donorAmount + partnerAmount + adminAmount;

	log.info(`
		Creating ${totalAmount} users: 
		${donorAmount} donors
		${partnerAmount} partners
		${adminAmount} admins
	`);

	for (let i = 0; i < totalAmount; i++) {
		let userRole;

		if (donorCounter > 0) {
			userRole = 'donor';
			donorCounter--;
		} else if (partnerCounter > 0) {
			userRole = 'partner';
			partnerCounter--;
		} else if (adminCounter > 0) {
			userRole = 'admin';
			adminCounter--;
		} else {
			throw new Error('We should never arrive here, what have you done?');
		}

		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const user = {
			fName: firstName,
			lName: lastName,
			email: `${firstName}.${lastName}@${faker.internet.domainName()}`,
			emailVerified: true,
			verificationHash: faker.random.alphaNumeric(18),
			userRole,
			password: bcrypt.hashSync(`${firstName}!`, 10),
			joined: Date.now(),
			aboutMe: faker.lorem.sentence(),
			loginMode: 'default',
		};

		users.push(user);
		const credentials = { email: user.email, password: `${user.fName}!` };

		switch (userRole) {
			case 'donor':
				donors.push(credentials);
				break;
			case 'partner':
				partners.push(credentials);
				break;
			case 'admin':
				admins.push(credentials);
				break;
			default:
				break;
		}
	}

	userCredentials.donors = donors;
	userCredentials.partners = partners;
	userCredentials.admins = admins;

	await User.insertMany(users);

	fs.writeFile(
		`${__dirname}/seederCredentials.json`,
		JSON.stringify(userCredentials, null, 4),
		'utf8',
		(err) => {
			if (err) {
				return log.error(err);
			}
			log.info(
				'Users successfully generated, credentials have been saved to seederCredentials.json',
			);
		},
	);
}

module.exports = {
	generateUsers,
};
