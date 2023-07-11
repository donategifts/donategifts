import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import UserRepository from '../db/repository/UserRepository';
import config from '../helper/config';
import Messaging from '../helper/messaging';
import Utils from '../helper/utils';

import BaseController from './basecontroller';

export default class PasswordController extends BaseController {
	private userRepository: UserRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();

		this.handleGetReset = this.handleGetReset.bind(this);
		this.handlePostReset = this.handlePostReset.bind(this);
		this.handleGetResetToken = this.handleGetResetToken.bind(this);
		this.handlePostResetToken = this.handlePostResetToken.bind(this);
	}

	handleGetReset(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'resetPassword');
	}

	async handlePostReset(req, res, _next) {
		try {
			const userObject = await this.userRepository.getUserByEmail(req.body.email);

			if (!userObject) {
				return this.handleError(res, 'user not found');
			}

			const resetToken = uuidv4();
			userObject.passwordResetToken = resetToken;
			userObject.passwordResetTokenExpires = moment().add(1, 'hours').toDate();
			userObject.save();

			await Messaging.sendPasswordResetMail(userObject.email, resetToken);

			res.send({ success: true });
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	// FIXME: redirects to wrong template
	async handleGetResetToken(req: Request, res: Response, _next: NextFunction) {
		try {
			const userObject = await this.userRepository.getUserByPasswordResetToken(
				req.params.token,
			);

			if (userObject) {
				if (new Date(String(userObject.passwordResetTokenExpires)) > new Date()) {
					this.renderView(res, 'resetPassword', {
						token: req.params.token,
					});
				} else {
					return this.handleError(res, 'Password token expired');
				}
			} else {
				return this.handleError(res, 'User not found');
			}
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePostResetToken(req: Request, res: Response, _next: NextFunction) {
		try {
			const userObject = await this.userRepository.getUserByPasswordResetToken(
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
						res.clearCookie(config.SESSION.NAME);
					});

					res.send({ success: true });
				} else {
					return this.handleError(res, 'Password token expired');
				}
			} else {
				return this.handleError(res, 'User not found');
			}
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
