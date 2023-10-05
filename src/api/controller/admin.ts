import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { LeanDocument } from 'mongoose';

import Agency from '../../db/models/Agency';
import AgencyRepository from '../../db/repository/AgencyRepository';
import UserRepository from '../../db/repository/UserRepository';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	private agencyRepository: AgencyRepository;

	private userRepository: UserRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.userRepository = new UserRepository();

		this.handleGetAgencyOverview = this.handleGetAgencyOverview.bind(this);
		this.handleGetAgencyDetail = this.handleGetAgencyDetail.bind(this);
		this.handleVerifyAgency = this.handleVerifyAgency.bind(this);
		this.handleUpdateAgencyData = this.handleUpdateAgencyData.bind(this);
	}

	async handleGetAgencyOverview(req: Request, res: Response, _next: NextFunction) {
		const getVerified = req.query.getVerified;
		try {
			let agencies: LeanDocument<
				Agency &
					Required<{
						_id: string;
					}>
			>[] = [];

			if (getVerified === 'true') {
				agencies = await this.agencyRepository.getVerifiedAgencies();
			} else {
				agencies = await this.agencyRepository.getUnverifiedAgencies();
			}

			const mappedAgencies = agencies.map((agency) => {
				return {
					id: agency._id,
					name: agency.agencyName,
					phone: agency.agencyPhone,
					website: agency.agencyWebsite,
					joined: moment(agency.joined).format('DD-MM-yyyy'),
					bio: agency.agencyBio,
					accountManager: agency.accountManager,
				};
			});

			return this.sendResponse(res, mappedAgencies);
		} catch (error) {
			this.log.error('error', error);
			return this.handleError(res, error);
		}
	}

	async handleGetAgencyDetail(req: Request, res: Response, _next: NextFunction) {
		try {
			const agency = await this.agencyRepository.getAgencyById(req.params.agencyId);

			if (!agency) {
				return this.handleError(res, 'Agency not found');
			}

			const accountManager = await this.userRepository.getUserByObjectId(
				agency.accountManager,
			);

			return this.sendResponse(res, {
				id: agency._id,
				name: agency.agencyName,
				phone: agency.agencyPhone,
				website: agency.agencyWebsite,
				joined: moment(agency.joined).format('DD-MM-yyyy'),
				bio: agency.agencyBio,
				verified: agency.isVerified,
				accountManager: {
					firstName: accountManager?.fName,
					lastName: accountManager?.lName,
					email: accountManager?.email,
					joined: moment(accountManager?.joined).format('DD-MM-yyyy'),
					verified: accountManager?.emailVerified,
				},
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleVerifyAgency(req: Request, res: Response, _next: NextFunction) {
		this.log.info(req.params.agencyId);
		try {
			const agency = await this.agencyRepository.verifyAgency(req.params.agencyId);

			if (!agency) {
				return this.handleError(res, 'Agency not found');
			}

			await Messaging.sendAgencyVerifiedMail(agency.accountManager.email);

			return this.sendResponse(res, {
				message: 'Agency verified',
				agency: {
					id: agency._id,
					name: agency.agencyName,
					phone: agency.agencyPhone,
					website: agency.agencyWebsite,
					joined: moment(agency.joined).format('DD-MM-yyyy'),
					bio: agency.agencyBio,
					verified: agency.isVerified,
					accountManager: {
						firstName: agency.accountManager.fName,
						lastName: agency.accountManager.lName,
						email: agency.accountManager.email,
						joined: moment(agency.accountManager.joined).format('DD-MM-yyyy'),
						verified: agency.accountManager.emailVerified,
					},
				},
			});
		} catch (error) {
			this.log.error('[AdminController] verifyAgency: ', error);
			return this.handleError(res, 'Failed to verify agency');
		}
	}

	async handleUpdateAgencyData(req: Request, res: Response, _next: NextFunction) {
		try {
			const { name, phone, website, bio } = req.body;

			const result = await this.agencyRepository.updateAgencyById(req.params.agencyId, {
				agencyName: name,
				agencyPhone: phone,
				agencyWebsite: website,
				agencyBio: bio,
			});

			if (result.matchedCount !== 1) {
				return this.handleError(res, 'Agency could not be updated, check post params');
			}

			return this.sendResponse(res, {
				message: 'Agency updated',
			});
		} catch (error) {
			this.log.error('[AdminController] updateAgencyData: ', error);
			return this.handleError(res, 'Failed to update agency');
		}
	}
}
