import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import Agency from '../../db/models/Agency';
import User from '../../db/models/User';
import AgencyRepository from '../../db/repository/AgencyRepository';
import UserRepository from '../../db/repository/UserRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	private agencyRepository: AgencyRepository;
	private userRepository: UserRepository;
	private wishCardRepository: WishCardRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.userRepository = new UserRepository();
		this.wishCardRepository = new WishCardRepository();

		this.handleGetAgencyOverview = this.handleGetAgencyOverview.bind(this);
		this.handleGetAgencyDetail = this.handleGetAgencyDetail.bind(this);
		this.handleVerifyAgency = this.handleVerifyAgency.bind(this);
		this.handleUpdateAgencyData = this.handleUpdateAgencyData.bind(this);
		this.handleGetDraftWishcards = this.handleGetDraftWishcards.bind(this);
		this.handlePutDraftWishcard = this.handlePutDraftWishcard.bind(this);
	}

	private formatAgencyResponse(agency: Agency, manager: User) {
		return {
			id: agency._id,
			name: agency.agencyName,
			phone: agency.agencyPhone,
			website: agency.agencyWebsite,
			joined: moment(agency.joined).format('DD-MM-yyyy'),
			bio: agency.agencyBio,
			verified: agency.isVerified,
			accountManager: {
				firstName: manager.fName,
				lastName: manager.lName,
				email: manager.email,
				joined: moment(manager.joined).format('DD-MM-yyyy'),
				verified: manager.emailVerified,
			},
		};
	}

	async handleGetAgencyOverview(req: Request, res: Response, _next: NextFunction) {
		const getVerified = req.query.getVerified;
		try {
			let agencies: Agency[] | null = [];

			if (getVerified === 'true') {
				agencies = await this.agencyRepository.getVerifiedAgencies();
			} else {
				agencies = await this.agencyRepository.getUnverifiedAgencies();
			}

			if (!agencies) {
				return this.handleError(res, 'No agencies found');
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

			let accountManager = await this.userRepository.getUserByObjectId(agency.accountManager);

			if (!accountManager) {
				this.log.error(
					`[AdminController] handleGetAgencyDetail: Agency account manager not found`,
				);

				accountManager = {
					fName: '',
					lName: '',
					email: '',
					joined: new Date(),
					emailVerified: false,
				} as User;
			}

			return this.sendResponse(res, this.formatAgencyResponse(agency, accountManager));
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleVerifyAgency(req: Request, res: Response, _next: NextFunction) {
		try {
			const agency = await this.agencyRepository.verifyAgency(req.params.agencyId);

			if (!agency) {
				return this.handleError(res, 'Agency not found');
			}

			const accountManager = await this.userRepository.getUserByObjectId(
				agency.accountManager,
			);

			if (!accountManager) {
				await this.agencyRepository.updateAgencyById(req.params.agencyId, {
					isVerified: false,
				});

				return this.handleError(res, 'Agency account manager not found');
			}

			await Messaging.sendAgencyVerifiedMail(accountManager.email);

			return this.sendResponse(res, {
				message: 'Agency verified',
				agency: this.formatAgencyResponse(agency, accountManager),
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

	async handleGetDraftWishcards(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getWishCardsByStatus('draft');
			const agenciesWithWishCardsMap: Map<string, any[]> = new Map();

			for (const wishCard of wishcards) {
				const agencyName = wishCard.belongsTo.agencyName;
				if (!agenciesWithWishCardsMap.has(agencyName)) {
					agenciesWithWishCardsMap.set(agencyName, []);
				}
				agenciesWithWishCardsMap.get(agencyName)?.push(wishCard);
			}
			const agenciesWithWishCards = Object.fromEntries(agenciesWithWishCardsMap);
			return this.sendResponse(res, agenciesWithWishCards);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePutDraftWishcard(req: Request, res: Response, _next: NextFunction) {
		try {
			const { wishCardId, wishItemUrl } = req.body;
			const wishCardModifiedFields = {
				wishItemUrl,
				status: 'published',
			};

			await this.wishCardRepository.updateWishCardByObjectId(
				wishCardId,
				wishCardModifiedFields,
			);

			return this.sendResponse(res, wishCardId);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
