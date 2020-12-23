import { inject, injectable } from 'inversify';
import { AgencyRepository } from './database/AgencyRepository';

@injectable()
export class AgencyService {
	constructor(@inject(AgencyRepository) private agencyRepository: AgencyRepository) {}
}
