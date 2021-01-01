import { IUser, IWishCard, ObjectId, TypeObjectId, UserRoles } from '@donategifts/common';
import { AgencyRepository } from '@donategifts/agency';
import { WishCardRepository } from '@donategifts/wishcard';
import { inject, injectable } from 'inversify';
import { UserRepository } from './database/UserRepository';

@injectable()
export class UserService {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		private agencyRepository: typeof AgencyRepository = AgencyRepository,
		private wishCardRepository: typeof WishCardRepository = WishCardRepository,
	) {}

	public async getUser(id: string): Promise<IUser> {
		return this.userRepository.getUserById(ObjectId<IUser>(id));
	}

	public async getUserRole(id: string): Promise<UserRoles> {
		const agency = await this.agencyRepository.getAgencyByUserId(ObjectId<IUser>(id));

		if (agency) {
			return UserRoles.Agency;
		}

		return UserRoles.Donor;
	}

	public async getAssignedWishCards(user: IUser): Promise<IWishCard[]> {
		const agency = await this.agencyRepository.getAgencyByUserId(user._id);

		// If user hadn't filled out agency info, redirect them to form
		if (!agency) {
			throw new Error(`Failed to get Agency for user ${user.email}`);
		}
		return this.wishCardRepository.getWishCardsByAgencyId(agency._id);
	}

	public async updateUserData(
		id: TypeObjectId<IUser>,
		params: Partial<Omit<IUser, '_id'>>,
	): Promise<IUser> {
		return this.userRepository.updateUserById(id, params);
	}

	public async verifyUserEmail(hash: string): Promise<boolean> {
		const user = await this.userRepository.getUserByVerificationHash(hash);

		if (user) {
			if (user.emailVerified) {
				return false;
			}

			await this.userRepository.setUserEmailVerification(user._id, true);
			return true;
		}

		throw new Error('No user found for verification!');
	}
}
