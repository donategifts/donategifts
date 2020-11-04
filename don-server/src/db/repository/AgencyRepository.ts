import { TypeObjectId } from '../../interfaces/IGeneric';
import { DBAgency, IDBAgency } from '../models/Agency';

export default class AgencyRepository {
  async getAgencyByUserId(userId: TypeObjectId<string>): Promise<IDBAgency | null> {
    try {
      return DBAgency.findOne({ accountManager: userId }).exec();
    } catch (error) {
      throw new Error(`Failed to get Agency: ${error}`);
    }
  }

  async getAgencyWishCards(agencyId: TypeObjectId<string>): Promise<IDBAgency | null> {
    try {
      return DBAgency.findOne({ _id: agencyId }).populate('wishCards').exec();
    } catch (error) {
      throw new Error(`Failed to get Wishcards: ${error}`);
    }
  }

  async createNewAgency(agencyParams): Promise<void> {
    try {
      const newAgency = new DBAgency(agencyParams);
      await newAgency.save();
    } catch (error) {
      throw new Error(`Failed to create Agency: ${error}`);
    }
  }

  async pushNewWishCardToAgency(id: TypeObjectId<string>, wishCard): Promise<IDBAgency> {
    try {
      return DBAgency.updateOne(
        { _id: id },
        { $push: { wishCards: wishCard } },
        { new: true },
      ).exec();
    } catch (error) {
      throw new Error(`Failed to add wishcard to agency: ${error}`);
    }
  }
}
