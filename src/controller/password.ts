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
		this.handlePostNew = this.handlePostNew.bind(this);
	}

	handleGetReset(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'passwordreset');
	}

	async handlePostReset(req: Request, res: Response, _next: NextFunction) {
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

			return res.send({ success: true });
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetResetToken(req: Request, res: Response, _next: NextFunction) {
		try {
			const user = await this.userRepository.getUserByPasswordResetToken(req.params.token);

			if (user) {
				if (new Date(String(user.passwordResetTokenExpires)) > new Date()) {
					return this.renderView(res, 'passwordresetconfirmation', {
						token: req.params.token,
					});
				} else {
					this.log.warn(
						'[PasswordController] handleGetResetToken: Password token expired',
					);
					return res.redirect('/password/reset');
				}
			}

			this.log.error('[PasswordController] handleGetResetToken: User not found');
			return res.redirect('/');
		} catch (error) {
			return this.handleError(res, error, 500, true);
		}
	}

	async handlePostNew(req: Request, res: Response, _next: NextFunction) {
		try {
			const user = await this.userRepository.getUserByPasswordResetToken(req.body.token);

			if (user) {
				if (moment(user.passwordResetTokenExpires) > moment()) {
					const newPassword = await Utils.hashPassword(req.body.password);
					await this.userRepository.updateUserById(user._id, {
						password: newPassword,
						passwordResetToken: null,
						passwordResetTokenExpires: null,
					});

					req.session.destroy(() => {
						res.clearCookie(config.SESSION.NAME);
						return res.send({ success: true, url: '/login' });
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
}
