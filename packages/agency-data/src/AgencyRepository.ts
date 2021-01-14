import { inject, injectable } from 'inversify';
import { TypeObjectId, IUser, IAgency, IWishCard } from '@donategifts/common';
import { DBAgency } from './DBAgency';

// TODO: needs typing
@injectable()
export class AgencyRepository {
	constructor(@inject(DBAgency) private dbAgency: typeof DBAgency) {}

	async getAgencyByUserId(userId: TypeObjectId<IUser>): Promise<IAgency | null> {
		return this.dbAgency.findOne({ accountManager: userId }).lean().exec();
	}

	async getAgencyWishCards(agencyId: TypeObjectId<IAgency>): Promise<IAgency | null> {
		return this.dbAgency.findOne({ _id: agencyId }).populate('wishCards').lean().exec();
	}

	async createNewAgency(agencyParams): Promise<void> {
		await this.dbAgency.create(agencyParams);
	}

	async pushNewWishCardToAgency(
		id: TypeObjectId<IAgency>,
		wishCardId: TypeObjectId<IWishCard>,
	): Promise<IAgency> {
		return this.dbAgency
			.updateOne({ _id: id }, { $push: { wishCards: wishCardId } }, { new: true })
			.exec();
	}
}
