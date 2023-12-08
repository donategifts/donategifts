import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import Agency from '../../db/models/Agency';
import { STATUS } from '../../db/models/Donation';
import User from '../../db/models/User';
import AgencyRepository from '../../db/repository/AgencyRepository';
import DonationRepository from '../../db/repository/DonationRepository';
import UserRepository from '../../db/repository/UserRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	private agencyRepository: AgencyRepository;
	private userRepository: UserRepository;
	private wishCardRepository: WishCardRepository;

	private donationRepository: DonationRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.userRepository = new UserRepository();
		this.wishCardRepository = new WishCardRepository();
		this.donationRepository = new DonationRepository();
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
			let agencies: Agency[] | null;

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
			const { wishCardId, wishItemURL } = req.body;
			const wishCardModifiedFields = {
				wishItemURL,
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

	async handleGetAllDonations(_req: Request, res: Response, _next: NextFunction) {
		try {
			const donations = await this.donationRepository.getAllDonations();
			const data: {
				id: string;
				user: {
					id: string;
					name: string;
					email: string;
				};
				agency: {
					id: string;
					name: string;
					email: string;
				};
				wishCard: {
					id: string;
					childFirstName: string;
					productID: string;
					itemURL: string;
					shippingAddress: string;
				};
				tracking_info: string;
				date: string;
				status: STATUS;
				totalAmount: number;
			}[] = [];

			for (const donation of donations) {
				const user = donation.donationFrom;
				const agency = donation.donationTo;
				const wishCard = donation.donationCard;

				const agencyAccountManager = await this.userRepository.getUserByObjectId(
					agency?.accountManager,
				);

				const address = `${wishCard?.address?.address1 ?? ''} ${
					wishCard?.address?.address2 ?? ''
				} ${wishCard?.address?.city ?? ''} ${wishCard?.address?.state ?? ''} ${
					wishCard?.address?.zipcode ?? ''
				} ${wishCard?.address?.country ?? ''}`;
				const shippingAddress = wishCard?.address
					? address
					: 'No address found. Contact agency.';

				let wishProductId = '';
				const match = wishCard?.wishItemURL?.match(/\/dp\/([A-Z0-9]{10})/);

				if (wishCard?.productID) {
					wishProductId = wishCard.productID;
				} else if (match) {
					wishProductId = match[1];
				}

				data.push({
					id: donation._id,
					user: {
						id: user?._id,
						name: `${user?.fName} ${user?.lName}`,
						email: user?.email,
					},
					agency: {
						id: agency?._id || '',
						name: agency?.agencyName,
						email: agencyAccountManager?.email || '',
					},
					wishCard: {
						id: wishCard?._id,
						childFirstName: wishCard?.childFirstName,
						productID: wishProductId,
						itemURL: wishCard?.wishItemURL,
						shippingAddress,
					},
					tracking_info: donation.tracking_info || '',
					date: moment(donation.donationDate).format('MMM DD, YYYY'),
					status: donation.status,
					totalAmount: donation.donationPrice,
				});
			}

			// sort by status
			// confirmed donations first, then ordered donations, then delivered donations
			data.sort((a, b) => {
				if (a.status === 'confirmed' && b.status !== 'confirmed') {
					return -1;
				} else if (a.status !== 'confirmed' && b.status === 'confirmed') {
					return 1;
				} else if (a.status === 'ordered' && b.status === 'delivered') {
					return -1;
				} else if (a.status === 'delivered' && b.status === 'ordered') {
					return 1;
				} else {
					return 0;
				}
			});

			return this.sendResponse(res, data);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePutUpdateDonationStatus(req: Request, res: Response, _next: NextFunction) {
		try {
			const { donationId, status } = req.body;
			const statusUpdate = await this.donationRepository.updateDonationStatus(
				donationId,
				status,
			);

			if (statusUpdate && status === 'ordered') {
				const donation = await this.donationRepository.getDonationById(donationId);

				if (donation) {
					const agencyAccountManager = await this.userRepository.getUserByObjectId(
						donation.donationTo?.accountManager,
					);

					const wishCard = donation.donationCard;
					const address = `${wishCard?.address?.address1 ?? ''} ${
						wishCard?.address?.address2 ?? ''
					} ${wishCard?.address?.city ?? ''} ${wishCard?.address?.state ?? ''} ${
						wishCard?.address?.zipcode ?? ''
					} ${wishCard?.address?.country ?? ''}`;
					const shippingAddress = wishCard?.address
						? address
						: 'No address found. Please contact stacy@donate-gifts.com.';

					try {
						this.log.info('Sending the donor user shipping alert email.');
						await Messaging.sendDonorShippingAlert({
							donorEmail: donation.donationFrom?.email,
							donorFirstName: donation.donationFrom?.fName,
							childName: wishCard?.childFirstName,
							itemName: wishCard?.wishItemName,
							agencyName: donation.donationTo?.agencyName,
							donationOrderId: donationId,
							trackingInfo: donation.tracking_info,
							wishCardId: wishCard._id,
						});
					} catch (error) {
						this.log.error(`Failed to send Donor Shipping Alert: ${error}`);
					}

					if (agencyAccountManager) {
						try {
							this.log.info('Sending the agency user shipping alert email.');
							await Messaging.sendAgencyShippingAlert({
								agencyEmail: agencyAccountManager.email,
								childName: wishCard?.childFirstName,
								donorFirstName: donation.donationFrom?.fName,
								itemName: wishCard?.wishItemName,
								donationOrderId: donationId,
								trackingInfo: donation.tracking_info,
								agencyAddress: shippingAddress,
							});
						} catch (error) {
							this.log.error(`Failed to send Agency Shipping Alert: ${error}`);
						}
					}
				}
			}

			return this.sendResponse(res, { message: 'Donation status updated' });
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePutUpdateTrackingInfo(req: Request, res: Response, _next: NextFunction) {
		try {
			const { id, tracking_info } = req.body;
			const result = await this.donationRepository.updateTrackingInfo(id, tracking_info);

			if (result.acknowledged) {
				return this.sendResponse(res, { message: 'Donation tracking info updated' });
			} else {
				return this.handleError(res, 'Failed to update donation tracking info');
			}
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
