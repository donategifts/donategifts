import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import UserRepository from '../../db/repository/UserRepository';
// import config from '../../helper/config';
// import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class SignupController extends BaseController {
	private userRepository: UserRepository;
	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.agencyRepository = new AgencyRepository();

		this.handlePostAgency = this.handlePostAgency.bind(this);
	}

	async handlePostAgency(req: Request, res: Response, _next: NextFunction) {
		try {
			const { agencyName, agencyWebsite, agencyPhone, agencyBio } = req.body;

			const agency = await this.agencyRepository.createNewAgency({
				...req.body,
				agencyName,
				agencyWebsite,
				agencyPhone,
				agencyBio,
				accountManager: res.locals.user._id,
			});

			// if (config.NODE_ENV !== 'test') {
			// 	await Messaging.sendAgencyVerificationNotification({
			// 		id: agency._id,
			// 		name: agency.agencyName,
			// 		website: agency.agencyWebsite,
			// 		bio: agency.agencyBio,
			// 	});
			// }
			return this.sendResponse(res, agency);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
