import { injectable } from 'inversify';
import { DonationRepository } from './database/DonationRepository';

@injectable()
export class DonationService {
	constructor(private donationRepository: typeof DonationRepository = DonationRepository) {}
}
