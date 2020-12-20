import { injectable } from 'inversify';
import { AgencyRepository } from './database/AgencyRepository';

@injectable()
export class AgencyService {
	constructor(private agencyRepository: typeof AgencyRepository = AgencyRepository) {}
}
