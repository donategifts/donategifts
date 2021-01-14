import { injectable } from 'inversify';
import { AgencyRepository } from '@donategifts/agency-data';

@injectable()
export class AgencyService {
	constructor(private agencyRepository: typeof AgencyRepository = AgencyRepository) {}
}
