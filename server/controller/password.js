const { v4: UUIDV4 } = require('uuid');
const moment = require('moment');

const UserRepository = require('../db/repository/UserRepository');
const BaseController = require('./basecontroller');

const MessageHelper = require('../helper/messaging');
const Utils = require('../helper/utils');

module.exports = class PasswordController extends BaseController {
	#userRepository;

	constructor() {
		super();

		this.#userRepository = new UserRepository();

		this.handleGetReset = this.handleGetReset.bind(this);
		this.handlePostReset = this.handlePostReset.bind(this);
		this.handleGetResetToken = this.handleGetResetToken.bind(this);
		this.handlePostResetToken = this.handlePostResetToken.bind(this);
	}

	handleGetReset(_req, res, _next) {
		this.renderView(res, 'resetPassword');
	}

	async handlePostReset(req, res, _next) {
		try {
			const userObject = await this.#userRepository.getUserByEmail(req.body.email);

			if (!userObject) {
				return this.handleError(res, 400, 'user not found');
			}

			const resetToken = UUIDV4();
			userObject.passwordResetToken = resetToken;
			userObject.passwordResetTokenExpires = moment().add(1, 'hours');
			userObject.save();

			await MessageHelper.sendPasswordResetMail(userObject.email, resetToken);

			res.send({ success: true });
		} catch (error) {
			return this.handleError(res, 400, error);
		}
	}

	async handleGetResetToken(req, res, _next) {
		try {
			const userObject = await this.#userRepository.getUserByPasswordResetToken(
				req.params.token,
			);

			if (userObject) {
				if (new Date(userObject.passwordResetTokenExpires) > new Date()) {
					this.renderView(res, 'resetPassword', {
						token: req.params.token,
					});
				} else {
					return this.handleError(res, 400, 'Password token expired');
				}
			} else {
				return this.handleError(res, 400, 'User not found');
			}
		} catch (error) {
			return this.handleError(res, 400, error);
		}
	}

	async handlePostResetToken(req, res) {
		try {
			const userObject = await this.#userRepository.getUserByPasswordResetToken(
				req.params.token,
			);

			if (userObject) {
				if (moment(userObject.passwordResetTokenExpires) > moment()) {
					const newPassword = await Utils.hashPassword(req.body.password);
					userObject.password = newPassword;
					userObject.passwordResetToken = null;
					userObject.passwordResetTokenExpires = null;
					userObject.save();

					req.session.destroy(() => {
						res.clearCookie(process.env.SESS_NAME);
					});

					res.send({ success: true });
				} else {
					return this.handleError(res, 400, 'Password token expired');
				}
			} else {
				return this.handleError(res, 400, 'User not found');
			}
		} catch (error) {
			return this.handleError(res, 400, error);
		}
	}
};
