import { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import UsersRepository from '../../db/repository/postgres/UsersRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';
import Utils from '../../helper/utils';

import BaseController from './basecontroller';

export default class SignupController extends BaseController {
	private readonly usersRepository: UsersRepository;
	private readonly agenciesRepository: AgenciesRepository;

	constructor(database: Kysely<DB>) {
		super();
		this.usersRepository = new UsersRepository(database);
		this.agenciesRepository = new AgenciesRepository(database);

		this.handlePostSignup = this.handlePostSignup.bind(this);
		this.handlePostAgency = this.handlePostAgency.bind(this);
	}

	async handlePostSignup(req: Request, res: Response, _next: NextFunction) {
		const { first_name, last_name, email, password, userRole, captchaToken } = req.body;

		if (config.NODE_ENV === 'production') {
			const isCaptchaValid = await Utils.validateReCaptchaToken(captchaToken);
			if (isCaptchaValid === false) {
				return this.handleError(res, {
					msg: 'Provided captcha token is not valid',
					param: 'captchaToken',
					location: 'body',
				});
			}
		}

		const candidate = await this.usersRepository.getByEmail(email.toLowerCase());

		if (candidate) {
			return this.handleError(res, 'This email is already taken. Try another', 409);
		}

		const { user, emailVerificationToken } = await this.usersRepository.create(
			{
				first_name,
				last_name,
				email: email.toLowerCase(),
				password: await Utils.hashPassword(password),
				role: userRole,
				bio: '',
				image_id: null,
				login_mode: 'email',
			},
			'email',
		);

		try {
			await Messaging.sendVerificationEmail(email, emailVerificationToken);

			let url = '/profile';
			req.session.user = user;
			res.locals.user = user;

			if (user.role === 'partner') {
				url = '/signup/agency';
			}

			return this.sendResponse(res, {
				url,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePostAgency(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				bio,
				name,
				website,
				phone,
				address_line_1,
				address_line_2,
				city,
				state,
				country_code,
				zip_code,
			} = req.body;

			const agency = await this.agenciesRepository.create({
				bio,
				phone,
				name,
				website,
				address_line_1,
				address_line_2,
				city,
				state,
				country_code,
				zip_code,
				account_manager_id: res.locals.user.id,
				image_id: null,
				employer_identification_number: null,
			});

			await Messaging.sendAgencyVerificationNotification({
				id: agency.id,
				name: agency.name,
				website: agency.website,
				bio: agency.bio,
			});

			return this.sendResponse(res, {
				url: '/profile',
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
