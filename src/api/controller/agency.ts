import { NextFunction, Request, Response } from 'express';
import { Selectable } from 'kysely';

import { Agencies } from '../../db/types/generated/database';

import BaseController from './basecontroller';

export default class AgencyController extends BaseController {
    async handleGetDetails(req: Request, res: Response, _next: NextFunction) {
        try {
            let agency = {} as Selectable<Agencies>;

            if (req.query.agencyId) {
                agency = await this.agenciesRepository.getById(req.query.agencyId.toString());
            } else if (req.query.userId) {
                agency = await this.agenciesRepository.getByAccountManagerId(
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
