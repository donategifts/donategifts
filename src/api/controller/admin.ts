import { NextFunction, Request, Response } from 'express';
import { Kysely, NoResultError, Selectable } from 'kysely';
import moment from 'moment';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import UsersRepository from '../../db/repository/postgres/UsersRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import { Agencies, DB, Users } from '../../db/types/generated/database';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
    private readonly agenciesRepository: AgenciesRepository;
    private readonly usersRepository: UsersRepository;
    private readonly wishCardRepository: WishCardRepository;

    constructor(database: Kysely<DB>) {
        super();

        this.agenciesRepository = new AgenciesRepository(database);
        this.usersRepository = new UsersRepository(database);
        this.wishCardRepository = new WishCardRepository();
    }

    private formatAgencyResponse(agency: Selectable<Agencies>, manager: Selectable<Users>) {
        return {
            id: agency.id,
            name: agency.name,
            phone: agency.phone,
            website: agency.website,
            joined: moment(agency.created_at).format('DD-MM-yyyy'),
            bio: agency.bio,
            verified: agency.is_verified,
            accountManager: {
                firstName: manager.first_name,
                lastName: manager.last_name,
                email: manager.email,
                joined: moment(manager.created_at).format('DD-MM-yyyy'),
                verified: manager.is_verified,
            },
        };
    }

    async handleGetAgencyOverview(req: Request, res: Response, _next: NextFunction) {
        const getVerified = req.query.getVerified;
        try {
            const agencies = await this.agenciesRepository.getByVerificationStatus(
                getVerified === 'true',
            );

            const mappedAgencies = agencies.map(agency => ({
                id: agency.id,
                name: agency.name,
                phone: agency.phone,
                website: agency.website,
                joined: moment(agency.created_at).format('DD-MM-yyyy'),
                bio: agency.bio,
                accountManager: agency.account_manager_id,
            }));

            return this.sendResponse(res, mappedAgencies);
        } catch (error) {
            this.log.error('[AdminController] handleGetAgencyOverview: ', error);
            return this.handleError(res, error);
        }
    }

    async handleGetAgencyDetail(req: Request, res: Response, _next: NextFunction) {
        try {
            const agency = await this.agenciesRepository.getById(req.params.agencyId);

            let accountManager = await this.usersRepository.getById(agency.account_manager_id);

            if (!accountManager) {
                this.log.error(
                    '[AdminController] handleGetAgencyDetail: Agency account manager not found, setting default values',
                );

                accountManager = {
                    first_name: '',
                    last_name: '',
                    email: '',
                    created_at: new Date(),
                    is_verified: false,
                } as Selectable<Users>;
            }

            return this.sendResponse(res, this.formatAgencyResponse(agency, accountManager));
        } catch (error) {
            this.log.error('[AdminController] handleGetAgencyDetail: ', error);

            if (error instanceof NoResultError) {
                return this.handleError(res, 'Agency not found');
            }

            return this.handleError(res, error);
        }
    }

    async handlePutVerifyAgency(req: Request, res: Response, _next: NextFunction) {
        try {
            const agency = await this.agenciesRepository.verify(req.params.agencyId);

            const accountManager = await this.usersRepository.getById(agency.account_manager_id);

            if (!accountManager) {
                await this.agenciesRepository.update(req.params.agencyId, {
                    is_verified: false,
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

            if (error instanceof NoResultError) {
                return this.handleError(res, 'Agency not found');
            }

            return this.handleError(res, 'Failed to verify agency');
        }
    }

    async handleUpdateAgencyData(req: Request, res: Response, _next: NextFunction) {
        try {
            const { name, phone, website, bio } = req.body;

            await this.agenciesRepository.update(req.params.agencyId, {
                name,
                phone,
                website,
                bio,
            });

            return this.sendResponse(res, {
                message: 'Agency updated',
            });
        } catch (error) {
            this.log.error('[AdminController] updateAgencyData: ', error);

            if (error instanceof NoResultError) {
                return this.handleError(res, 'Agency could not be updated, check post params');
            }

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
