// NPM DEPENDENCIES
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const rateLimit = require('express-rate-limit');

// handle picture upload
const WishCardMiddleWare = require('./middleware/wishCard.middleware');

const router = express.Router();

const {
	googlesignupValidationRules,
	fbsignupValidationRules,
	verifyHashValidationRules,
	passwordRequestValidationRules,
	updateProfileValidationRules,
	loginValidationRules,
	getPasswordResetValidationRules,
	postPasswordResetValidationRules,
	validate,
} = require('./validations/users.validations');
const { createEmailVerificationHash, sendPasswordResetMail } = require('../helper/messaging');
const { handleError } = require('../helper/error');
const log = require('../helper/logger');
const { verifyGoogleToken, hashPassword, createDefaultPassword } = require('../helper/user.helper');
const { redirectLogin, redirectProfile } = require('./middleware/login.middleware');

const UserRepository = require('../db/repository/UserRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');
const DonationRepository = require('../db/repository/DonationRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

// allow only 100 requests per 15 minutes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
});

// @desc    Render (home)
// @route   GET '/users'
// @access  Public
// @tested 	Yes
router.get('/', (req, res) => {
	try {
		res.status(200).redirect('/');
	} catch (err) {
		return handleError(res, 400, err);
	}
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/profile'
// @access  Private, only users
// @tested 	Yes
// TODO: add conditions to check userRole and limit 'createWishCard' access to 'partners' only
router.get('/profile', redirectLogin, async (req, res) => {
	try {
		const { user } = req.session;
		if (user.userRole === 'partner') {
			const agency = await AgencyRepository.getAgencyByUserId(user._id);

			// If user hadn't filled out agency info, redirect them to form
			if (!agency) {
				return res.status(200).render('pages/agency');
			}
			const wishCards = await WishCardRepository.getWishCardByAgencyId(agency._id);
			const wishCardsLength = wishCards.length;
			const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
			const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
			const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');
			res.status(200).render('profile', {
				wishCardsLength,
				draftWishcards,
				activeWishcards,
				inactiveWishcards,
			});
		} else {
			res.status(200).render('profile');
		}
	} catch (err) {
		return handleError(res, 400, err);
	}
});

// @desc    Update user about me info
// @route   PUT '/users/profile'
// @access  Private, only users
// @tested 	No?
router.put(
	'/profile',
	updateProfileValidationRules(),
	validate,
	redirectLogin,
	async (req, res) => {
		try {
			const { aboutMe } = req.body;

			// if no user id is present return forbidden status 403
			if (!req.session.user) {
				return handleError(res, 403, 'No user id in request');
			}

			const candidate = await UserRepository.getUserByObjectId(req.session.user._id);

			// candidate with id not found in database, return not found status 404
			if (!candidate) {
				return handleError(res, 404, 'User could not be found');
			}

			// update user and add aboutMe;
			await UserRepository.updateUserById(candidate._id, { aboutMe });

			res.status(200).send(
				JSON.stringify({
					success: true,
					error: null,
					data: aboutMe,
				}),
			);
		} catch (err) {
			return handleError(res, 400, err);
		}
	},
);

router.post(
	'/profile/picture',
	limiter,
	WishCardMiddleWare.upload.single('profileImage'),
	validate,
	redirectLogin,
	async (req, res) => {
		if (req.file === undefined) {
			handleError(
				res,
				400,
				'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		} else {
			try {
				let filePath;

				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				const profileImage = process.env.USE_AWS === 'true' ? req.file.Location : filePath;
				await UserRepository.updateUserById(req.session.user._id, { profileImage });
				res.status(200).send(
					JSON.stringify({
						success: true,
						error: null,
						data: profileImage,
					}),
				);
				log.info('Profile picture updated', {
					type: 'user_profile_picture_update',
					user: req.session.user._id,
				});
			} catch (error) {
				handleError(res, 400, error);
			}
		}
	},
);

router.delete('/profile/picture', limiter, redirectLogin, async (req, res) => {
	try {
		// if users had deleted picture replace it with string for the default avatar
		const defaultImage = '/public/img/default_profile_avatar.svg';
		await UserRepository.updateUserById(req.session.user._id, { profileImage: defaultImage });

		res.status(200).send(
			JSON.stringify({
				success: true,
				error: null,
				data: defaultImage,
			}),
		);

		log.info('Profile picture deleted', {
			type: 'user_profile_picture_delete',
			user: req.session.user._id,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

// @desc    handle google signup/login
// @route   POST '/google-signin'
// @access  Public
// @tested 	Not yet
router.post(
	'/google-signin',
	limiter,
	googlesignupValidationRules(),
	validate,
	async (req, res) => {
		const { id_token } = req.body;

		if (id_token) {
			try {
				const user = await verifyGoogleToken(id_token);
				const fName = user.firstName;
				const lName = user.lastName;
				const email = user.mail.toLowerCase();

				const dbUser = await UserRepository.getUserByEmail(email);

				if (dbUser) {
					req.session.user = dbUser;
					res.locals.user = dbUser;
					return res.status(200).send({
						url: '/users/profile',
					});
				}

				const newUser = await UserRepository.createNewUser({
					fName,
					lName,
					email,
					password: createDefaultPassword(),
					verificationHash: createEmailVerificationHash(),
					userRole: 'donor',
					loginMode: 'Google',
					emailVerified: true,
				});

				req.session.user = newUser;
				res.locals.user = newUser;
				return res.status(200).send({
					url: '/users/profile',
				});
			} catch (error) {
				return handleError(res, 400, 'Error during login!\nTry again in a few minutes!');
			}
		}

		return handleError(res, 400, 'Error during login!\nTry again in a few minutes!');
	},
);

// @desc    handle facebook signup/login
// @route   POST '/fb-signin'
// @access  Public
// @tested 	Not yet
router.post('/fb-signin', limiter, fbsignupValidationRules(), validate, async (req, res) => {
	const { userName, email } = req.body;

	if (userName && email) {
		const [fName, lName] = userName.split(' ');

		const dbUser = await UserRepository.getUserByEmail(email.toLowerCase());

		if (dbUser) {
			req.session.user = dbUser;
			res.locals.user = dbUser;
			return res.status(200).send({
				url: '/users/profile',
			});
		}

		try {
			const newUser = await UserRepository.createNewUser({
				fName,
				lName: lName || 'LastnameUnset',
				email: email.toLowerCase(),
				password: createDefaultPassword(),
				verificationHash: createEmailVerificationHash(),
				userRole: 'donor',
				loginMode: 'Facebook',
				emailVerified: true,
			});

			req.session.user = newUser;
			res.locals.user = newUser;
			return res.status(200).send({
				url: '/users/profile',
			});
		} catch (error) {
			return handleError(res, 400, 'Error during login!\nTry again in a few minutes!');
		}
	}

	return handleError(res, 400, 'Error during login!\nTry again in a few minutes!');
});

// @desc    Render login.html
// @route   POST '/users/login'
// @access  Public
// @tested 	Not yet
router.post(
	'/login',
	limiter,
	loginValidationRules(),
	validate,
	redirectProfile,
	async (req, res) => {
		const { email, password } = req.body;
		const user = await UserRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				req.session.user = user;
				res.locals.user = user;
				return res.status(200).send({ success: true, url: '/users/profile' });
			}
		}
		handleError(res, 403, 'Username and/or password incorrect');
	},
);

// @desc    Render login.html
// @route   GET '/users/logout'
// @access  Public
// @tested 	Not yet
router.get('/logout', redirectLogin, (req, res) => {
	req.session.destroy(() => {
		res.clearCookie(process.env.SESS_NAME);
		res.redirect('/users/login');
	});
});

// @desc    Render terms.ejs
// @route   GET '/users/terms'
// @access  public
// @tested 	No
router.get('/terms', async (req, res) => {
	try {
		res.render('terms', {
			user: res.locals.user,
		});
	} catch (err) {
		handleError(res, 400, err);
	}
});

// @desc    Render login.html
// @route   GET '/users/verify'
// @access  Public
// @tested 	Not yet
router.get('/verify/:hash', verifyHashValidationRules(), validate, async (req, res) => {
	try {
		let user = await UserRepository.getUserByVerificationHash(req.params.hash);

		if (user) {
			let agency = {};
			let wishCards = [];
			let wishCardsLength = 0;
			let draftWishcards = [];
			let activeWishcards = [];
			let inactiveWishcards = [];

			if (user.userRole === 'partner') {
				agency = await AgencyRepository.getAgencyByUserId(user._id);
				wishCards = await WishCardRepository.getWishCardByAgencyId(agency._id);
				wishCardsLength = wishCards.length;
				draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
				activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
				inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');
			}

			if (user.emailVerified) {
				if (req.session.user) {
					return res.status(200).render('profile', {
						user: res.locals.user,
						agency,
						wishCards,
						wishCardsLength,
						draftWishcards,
						activeWishcards,
						inactiveWishcards,
					});
				}
				return res.status(200).render('login', {
					user: res.locals.user,
					successNotification: {
						msg: 'Your email is already verified.',
					},
					errorNotification: null,
				});
			}

			user = await UserRepository.setUserEmailVerification(user._id, true);

			return res.status(200).render('profile', {
				user,
				agency,
				wishCards,
				wishCardsLength,
				draftWishcards,
				activeWishcards,
				inactiveWishcards,
				successNotification: {
					msg: 'Email Verification successful',
				},
				errorNotification: null,
			});
		}

		return handleError(res, 400, 'Email Verification failed!');
	} catch (error) {
		log.error(error);
		return res.status(400).render('login', {
			user: res.locals.user,
			successNotification: null,
			errorNotification: { msg: 'Email Verification failed' },
		});
	}
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/choose', redirectLogin, async (req, res) => {
	try {
		const { user } = res.locals;
		let params = { user };
		if (user.userRole === 'partner') {
			const agency = await AgencyRepository.getAgencyByUserId(user._id);
			if (!agency) {
				return handleError(res, 404, 'Agency Not Found');
			}
			params = { ...params, agency };
		}
		res.render('chooseItem', params);
	} catch (err) {
		return handleError(res, 400, err);
	}
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/password/request', async (req, res) => {
	try {
		res.render('requestPassword');
	} catch (err) {
		return handleError(res, 400, err);
	}
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.post(
	'/password/request',
	limiter,
	passwordRequestValidationRules(),
	validate,
	async (req, res) => {
		try {
			const userObject = await UserRepository.getUserByEmail(req.body.email);

			if (!userObject) return handleError(res, 400, 'user not found');

			const resetToken = uuidv4();
			userObject.passwordResetToken = resetToken;
			userObject.passwordResetTokenExpires = moment().add(1, 'hours');
			userObject.save();

			sendPasswordResetMail(userObject.email, resetToken);

			res.send({ success: true });
		} catch (err) {
			return handleError(res, 400, err);
		}
	},
);

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get(
	'/password/reset/:token',
	getPasswordResetValidationRules(),
	validate,
	async (req, res) => {
		try {
			const userObject = await UserRepository.getUserByPasswordResetToken(req.params.token);

			if (userObject) {
				if (new Date(userObject.passwordResetTokenExpires) > new Date()) {
					res.render('resetPassword', {
						token: req.params.token,
					});
				} else {
					return handleError(res, 400, 'Password token expired');
				}
			} else {
				return handleError(res, 400, 'User not found');
			}
		} catch (err) {
			return handleError(res, 400, err);
		}
	},
);

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.post(
	'/password/reset/:token',
	limiter,
	postPasswordResetValidationRules(),
	validate,
	async (req, res) => {
		try {
			const userObject = await UserRepository.getUserByPasswordResetToken(req.params.token);

			if (userObject) {
				if (moment(userObject.passwordResetTokenExpires) > moment()) {
					const newPassword = await hashPassword(req.body.password);
					userObject.password = newPassword;
					userObject.passwordResetToken = null;
					userObject.passwordResetTokenExpires = null;
					userObject.save();

					req.session.destroy(() => {
						res.clearCookie(process.env.SESS_NAME);
					});

					res.send({ success: true });
				} else {
					return handleError(res, 400, 'Password token expired');
				}
			} else {
				return handleError(res, 400, 'User not found');
			}
		} catch (err) {
			return handleError(res, 400, err);
		}
	},
);

// @desc    Get agency details.
// @access  Private, only users
router.get('/agency/address', async (req, res) => {
	try {
		if (!req.session.user) {
			return handleError(res, 403, 'No user id in request');
		}
		const agencyDetail = await AgencyRepository.getAgencyByUserId(req.session.user._id);
		res.status(200).send(
			JSON.stringify({
				success: true,
				error: null,
				data: agencyDetail,
			}),
		);
	} catch (err) {
		return handleError(res, 400, err);
	}
});

router.get('/profile/donations', redirectLogin, async (req, res) => {
	try {
		const { user } = req.session;
		let donations;
		if (user.userRole === 'partner') {
			const { agency } = req.session;
			donations = await DonationRepository.getDonationsByAgency(agency._id);
		} else {
			donations = await DonationRepository.getDonationsByUser(user._id);
		}
		res.render('donationHistory', { donations }, (error, html) => {
			if (error) {
				res.status(400).json({ success: false, error });
			} else {
				res.status(200).send(html);
			}
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

module.exports = router;
