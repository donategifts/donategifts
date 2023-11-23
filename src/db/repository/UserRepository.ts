import User from '../models/User';

export default class UserRepository {
    private userModel: typeof User;

    constructor() {
        this.userModel = User;
    }

    async getUserByObjectId(id: string): Promise<User | null> {
        try {
            return await this.userModel.findOne({ _id: id }).lean().exec();
        } catch (error) {
            throw new Error(`Failed to get DB user: ${error}`);
        }
    }

    async updateUserById(id: string, updateParams: Partial<User>) {
        try {
            await this.userModel.updateOne({ _id: id }, { $set: updateParams }).exec();
        } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }

    async getUserAndUpdateById(id: string, updateParams: Partial<User>) {
        try {
            return await this.userModel
                .findOneAndUpdate({ _id: id }, { $set: updateParams }, { new: true })
                .lean()
                .exec();
        } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }

    async getUserByEmail(email: string) {
        try {
            return await this.userModel.findOne({ email }).exec();
        } catch (error) {
            throw new Error(`Failed to get DB user: ${error}`);
        }
    }

    async getUserByVerificationHash(verificationHash: string) {
        try {
            return await this.userModel.findOne({ verificationHash }).lean().exec();
        } catch (error) {
            throw new Error(`Failed to get DB user: ${error}`);
        }
    }

    async createNewUser(params: Partial<User>) {
        try {
            return await this.userModel.create(params);
        } catch (error) {
            throw new Error(`Failed to create new User: ${error}`);
        }
    }

    getUserByPasswordResetToken(tokenId: string): Promise<User | null> {
        return this.userModel.findOne({ passwordResetToken: tokenId }).lean().exec();
    }

    async setUserEmailVerification(userId: string, verified: boolean) {
        try {
            await this.userModel
                .updateOne({ _id: userId }, { $set: { emailVerified: verified } })
                .lean()
                .exec();
        } catch (error) {
            throw new Error(`Failed to set email verification: ${error}`);
        }
    }
}
