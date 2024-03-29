import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../db/repository/AgencyRepository';
import UserRepository from '../db/repository/UserRepository';
import config from '../helper/config';
import Messaging from '../helper/messaging';
import Utils from '../helper/utils';

import BaseController from './basecontroller';

export default class SignupController extends BaseController {
	private userRepository: UserRepository;

	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.agencyRepository = new AgencyRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostSignup = this.handlePostSignup.bind(this);
		this.handleGetAgency = this.handleGetAgency.bind(this);
		this.handlePostAgency = this.handlePostAgency.bind(this);
	}

	private async sendEmail(email: string, verificationHash: string) {
		const emailResponse = await Messaging.sendVerificationEmail(email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (config.NODE_ENV === 'development') {
			this.log.info(response);
		}
	}

	handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		if (res.locals.user) {
			const { userRole } = res.locals.user;

			if (userRole === 'partner') {
				return this.renderView(res, 'signup/agencydata');
			}

			this.renderView(res, 'profile');
		} else {
			this.renderView(res, 'signup/basecontact');
		}
	}

	async handlePostSignup(req: Request, res: Response, _next: NextFunction) {
		const { fName, lName, email, password, userRole, captchaToken } = req.body;

		if (config.NODE_ENV === 'production') {
			// validate captcha code. False if its invalid
			const isCaptchaValid = await Utils.validateReCaptchaToken(captchaToken);
			if (isCaptchaValid === false) {
				return this.handleError(res, {
					msg: 'Provided captcha token is not valid',
					param: 'captchaToken',
					location: 'body',
				});
			}
		}

		const candidate = await this.userRepository.getUserByEmail(email.toLowerCase());

		if (candidate) {
			return this.handleError(res, 'This email is already taken. Try another', 409);
		}

		const hashedPassword = await Utils.hashPassword(password);
		const verificationHash = Utils.createEmailVerificationHash();

		const newUser = await this.userRepository.createNewUser({
			fName,
			lName,
			email: email.toLowerCase(),
			verificationHash,
			password: hashedPassword,
			userRole,
			loginMode: 'Default',
		});

		try {
			if (req) {
				this.sendEmail(email, verificationHash);

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
			} else {
				return this.handleError(res, 'request already ended', 500);
			}
		} catch (error) {
			return this.handleError(res, error, 206);
		}
	}

	async handleGetAgency(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'signup/agencydata');
	}

	async handlePostAgency(req: Request, res: Response, _next: NextFunction) {
		try {
			const { agencyName, agencyWebsite, agencyPhone, agencyBio, agencyAddress } = req.body;

			const agency = await this.agencyRepository.createNewAgency({
				...req.body,
				agencyName,
				agencyWebsite,
				agencyPhone,
				agencyBio,
				agencyAddress,
				accountManager: res.locals.user._id,
			});

			if (config.NODE_ENV !== 'test') {
				await Messaging.sendAgencyVerificationNotification({
					id: agency._id,
					name: agency.agencyName,
					website: agency.agencyWebsite,
					bio: agency.agencyBio,
				});
			}

			return res.status(200).send({
				success: true,
				user: res.locals.user,
				url: '/profile',
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
