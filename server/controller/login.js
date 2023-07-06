const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const BaseController = require('./basecontroller');
const UserRepository = require('../db/repository/UserRepository');

const config = require('../../config');

module.exports = class LoginController extends BaseController {
	#userRepository;

	constructor() {
		super();

		this.#userRepository = new UserRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostIndex = this.handlePostIndex.bind(this);
		this.handlePostGoogleLogin = this.handlePostGoogleLogin.bind(this);
	}

	handleGetIndex(_req, res, _next) {
		this.renderView(res, 'login');
	}

	async handlePostIndex(req, res, _next) {
		const { email, password } = req.body;
		const user = await this.#userRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				req.session.user = user;
				res.locals.user = user;
				return res.status(200).send({ success: true, url: '/profile' });
			}
		}
		this.handleError({ res, code: 403, error: 'Username and/or password incorrect' });
	}

	async handlePostGoogleLogin(req, res, _next) {
		const { id_token } = req.body;

		if (id_token) {
			try {
				const user = await LoginController.verifyGoogleToken(id_token);
				const fName = user.firstName;
				const lName = user.lastName;
				const email = user.mail.toLowerCase();

				const dbUser = await UserRepository.getUserByEmail(email);

				if (dbUser) {
					req.session.user = dbUser;
					res.locals.user = dbUser;
					return res.status(200).send({
						url: '/profile',
					});
				}

				const newUser = await UserRepository.createNewUser({
					fName,
					lName,
					email,
					password: LoginController.createDefaultPassword(),
					verificationHash: LoginController.createEmailVerificationHash(),
					userRole: 'donor',
					loginMode: 'Google',
					emailVerified: true,
				});

				req.session.user = newUser;
				res.locals.user = newUser;
				return res.status(200).send({
					url: '/profile',
				});
			} catch (error) {
				return this.handleError({
					res,
					code: 400,
					error: 'Error during login!\nTry again in a few minutes!',
				});
			}
		}

		return this.handleError({
			res,
			code: 400,
			error: 'Error during login!\nTry again in a few minutes!',
		});
	}

	async handlePostFacebookLogin(req, res, _next) {
		const { userName, email } = req.body;

		if (userName && email) {
			const [fName, lName] = userName.split(' ');

			const dbUser = await UserRepository.getUserByEmail(email.toLowerCase());

			if (dbUser) {
				req.session.user = dbUser;
				res.locals.user = dbUser;
				return res.status(200).send({
					url: '/profile',
				});
			}

			try {
				const newUser = await UserRepository.createNewUser({
					fName,
					lName: lName || 'LastnameUnset',
					email: email.toLowerCase(),
					password: LoginController.createDefaultPassword(),
					verificationHash: LoginController.createEmailVerificationHash(),
					userRole: 'donor',
					loginMode: 'Facebook',
					emailVerified: true,
				});

				req.session.user = newUser;
				res.locals.user = newUser;
				return res.status(200).send({
					url: '/profile',
				});
			} catch (error) {
				return this.handleError({
					res,
					code: 400,
					error: 'Error during login!\nTry again in a few minutes!',
				});
			}
		}

		return this.handleError({
			res,
			code: 400,
			error: 'Error during login!\nTry again in a few minutes!',
		});
	}

	static async verifyGoogleToken(token) {
		const oauthClient = new OAuth2Client(config.G_CLIENT_ID);
		const ticket = await oauthClient.verifyIdToken({
			idToken: token,
			audience: config.G_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		return {
			firstName: payload.given_name,
			lastName: payload.family_name || 'LastnameUnset',
			mail: payload.email,
		};
	}

	static async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	static createDefaultPassword() {
		return Math.random().toString(36).slice(-8);
	}
};
