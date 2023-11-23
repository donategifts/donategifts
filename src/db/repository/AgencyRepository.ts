import Agency from '../models/Agency';
import User from '../models/User';

export default class AgencyRepository {
    private agencyModel: typeof Agency;

    constructor() {
        this.agencyModel = Agency;
    }

    getAgencyByUserId(userId: string): Promise<Agency | null> {
        return this.agencyModel.findOne({ accountManager: userId }).lean().exec();
    }

    getAgencyById(agencyId: string): Promise<Agency | null> {
        return this.agencyModel.findById(agencyId).lean().exec();
    }

    getAgencyByName(
        agencyName: string,
    ): Promise<(Omit<Agency, 'accountManager'> & { accountManager: User }) | null> {
        return this.agencyModel
            .findOne({ agencyName })
            .populate<{ accountManager: User }>('accountManager')
            .lean()
            .exec();
    }

    async createNewAgency(agencyParams: Agency) {
        try {
            return await this.agencyModel.create(agencyParams);
        } catch (error) {
            throw new Error(`Failed to create Agency: ${error}`);
        }
    }

    verifyAgency(agencyId: string): Promise<Agency | null> {
        return this.agencyModel
            .findOneAndUpdate({ _id: agencyId }, { $set: { isVerified: true } }, { new: true })
            .lean()
            .exec();
    }

    getVerifiedAgencies(): Promise<Agency[] | null> {
        return this.agencyModel.find({ isVerified: true }).lean().exec();
    }

    getUnverifiedAgencies(): Promise<Agency[] | null> {
        return this.agencyModel.find({ isVerified: false }).lean().exec();
    }

    async updateAgency(id: string, agencyFields: Partial<Agency>) {
        try {
            return await this.agencyModel
                .updateOne({ accountManager: id }, { $set: { ...agencyFields } })
                .lean()
                .exec();
        } catch (error) {
            throw new Error(`Failed to update agency details: ${error}`);
        }
    }

    updateAgencyById(id: string, agencyFields: Partial<Agency>) {
        return this.agencyModel
            .updateOne({ _id: id }, { $set: { ...agencyFields } })
            .lean()
            .exec();
    }
}
