import { inject, injectable } from 'inversify';
import { DonationRepository } from './database/DonationRepository';

@injectable()
export class DonationService {
	constructor(@inject(DonationRepository) private donationRepository: DonationRepository) {}
}
