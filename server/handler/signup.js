const BaseHandler = require('./basehandler');
const Utils = require('../helper/utils');
const UserRepository = require('../db/repository/UserRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');
const {
	createEmailVerificationHash,
	sendVerificationEmail,
	sendAgencyVerificationNotification,
} = require('../helper/messaging');

module.exports = class SignupHandler extends BaseHandler {
	#userRepository;

	#agencyRepository;

	constructor() {
		super();

		this.#userRepository = new UserRepository();
		this.#agencyRepository = new AgencyRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostSignup = this.handlePostSignup.bind(this);
		this.handleGetAgency = this.handleGetAgency.bind(this);
		this.handlePostAgency = this.handlePostAgency.bind(this);
	}

	handleGetIndex(_req, res, _next) {
		let userRole = null;

		if (res.locals?.user) {
			userRole = res.locals.user.userRole;
		}

		if (userRole === 'partner') {
			this.renderView(res, 'agency');
		} else {
			this.renderView(res, 'signup');
		}
	}

	async #sendEmail(email, verificationHash) {
		const emailResponse = await sendVerificationEmail(email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (process.env.NODE_ENV === 'development') {
			this.log.info(response);
		}
	}

	async handlePostSignup(req, res, _next) {
		const { fName, lName, email, password, userRole, captchaToken } = req.body;

		// validate captcha code. False if its invalid
		const isCaptchaValid = await Utils.validateReCaptchaToken(captchaToken);
		if (isCaptchaValid === false) {
			return this.handleError({
				res,
				code: 400,
				error: {
					msg: 'Provided captcha token is not valid',
					param: 'captchaToken',
					location: 'body',
				},
			});
		}

		const candidate = await this.#userRepository.getUserByEmail(email.toLowerCase());

		if (candidate) {
			return this.handleError({
				res,
				code: 409,
				error: 'This email is already taken. Try another',
			});
		}

		const hashedPassword = await Utils.hashPassword(password);
		const verificationHash = createEmailVerificationHash();

		const newUser = await this.#userRepository.createNewUser({
			fName,
			lName,
			email: email.toLowerCase(),
			verificationHash,
			password: hashedPassword,
			userRole,
			loginMode: 'Default',
		});

		try {
			this.#sendEmail(email, verificationHash);

			let url = '';
			req.session.user = newUser;
			if (newUser.userRole === 'partner') {
				url = '/signup/agency';
			} else {
				url = '/profile';
			}

			return res.status(200).send({
				url,
				user: newUser,
			});
		} catch (error) {
			return this.handleError({ res, code: 206, error });
		}
	}

	async handleGetAgency(_req, res) {
		this.renderView(res, 'agency');
	}

	async handlePostAgency(req, res, _next) {
		try {
			const { agencyName, agencyWebsite, agencyPhone, agencyBio, agencyAddress } = req.body;

			const result = await this.#agencyRepository.createNewAgency({
				...req.body,
				agencyName,
				agencyWebsite,
				agencyPhone,
				agencyBio,
				agencyAddress,
				accountManager: req.session.user._id,
			});

			if (process.env.NODE_ENV !== 'test') {
				await sendAgencyVerificationNotification({
					id: result.agency._id,
					name: result.agency.agencyName,
					website: result.agency.agencyWebsite,
					bio: result.agency.agencyBio,
				});
			}

			return res.status(200).send({
				success: true,
				user: req.session.user,
				url: '/profile',
			});
		} catch (error) {
			return this.handleError({ res, code: 400, error });
		}
	}
};
