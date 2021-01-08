import { inject, injectable } from 'inversify';
import { DBDonation } from './DBDonation';

// TODO: needs typing!!
@injectable()
export class DonationRepository {
	constructor(@inject(DBDonation) private dbDonation: typeof DBDonation) {}

	async createNewDonation(params) {
		return this.dbDonation.create(params);
	}
}
