import { NextFunction, Request, Response } from 'express';
import { Kysely, Selectable } from 'kysely';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import { DB, Agencies } from '../../db/types/generated/database';

import BaseController from './basecontroller';

export default class AgencyController extends BaseController {
    private readonly agencyRepository: AgenciesRepository;

    constructor(database: Kysely<DB>) {
        super();

        this.agencyRepository = new AgenciesRepository(database);
    }

    async handleGetDetails(req: Request, res: Response, _next: NextFunction) {
        try {
            let agency = {} as Selectable<Agencies>;

            if (req.query.agencyId) {
                agency = await this.agencyRepository.getById(req.query.agencyId.toString());
            } else if (req.query.userId) {
                agency = await this.agencyRepository.getByAccountManagerId(
                    req.query.userId.toString(),
                );
            }

            return this.sendResponse(res, agency);
        } catch (error) {
            this.log.error('[AgencyController] getAgency: ', error);

            return this.handleError(res, error);
        }
    }
}
