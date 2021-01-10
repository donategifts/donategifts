import { IUser, IWishCard, ObjectId, TypeObjectId, UserRoles } from '@donategifts/common';
import { AgencyRepository } from '@donategifts/agency';
import { WishCardRepository } from '@donategifts/wishcard';
import { inject, injectable } from 'inversify';
import * as uuidV4 from 'uuid';
import * as moment from 'moment';
import { sendPasswordResetMail } from '@donategifts/helper';
import { UserRepository } from './database/UserRepository';
import { UserError } from './helper/UserError';

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

		if (!agency) {
			throw new UserError(`Failed to get Agency for user ${user.email}`);
		}
		return this.wishCardRepository.getWishCardsByAgencyId(agency._id);
	}

	public async updateUserData(id: TypeObjectId<IUser>, params: Partial<IUser>): Promise<IUser> {
		return this.userRepository.updateUserById(id, params);
	}

	public async verifyUserEmail(hash: string): Promise<IUser> {
		const user = await this.userRepository.getUserByVerificationHash(hash);

		if (!user) {
			throw new UserError('No user found for verification!');
		}

		if (!user.emailVerified) {
			return this.userRepository.setUserEmailVerification(user._id, true);
		}

		return user;
	}

	public async requestPasswordReset(email: string): Promise<void> {
		const user = await this.userRepository.getUserByEmail(email);

		if (!user) {
			throw new UserError('No user found with given email!');
		}

		const resetToken = uuidV4();
		const passwordResetToken = resetToken;
		const passwordResetTokenExpires = moment().add(1, 'hours').toDate();
		await this.userRepository.setPasswordResetToken(
			email,
			passwordResetToken,
			passwordResetTokenExpires,
		);

		await sendPasswordResetMail(email, resetToken);
	}

	public async verifyValidPasswordResetToken(
		token: string,
	): Promise<{ success: boolean; message?: string }> {
		const user = await this.userRepository.getUserByPasswordResetToken(token);

		if (user) {
			if (user.passwordResetTokenExpires) {
				if (new Date(user.passwordResetTokenExpires) > new Date()) {
					return { success: true };
				}
				return { success: false, message: 'TOKEN_EXPIRED' };
			}
			return { success: false, message: 'NO_TOKEN_SET' };
		}

		return {
			success: false,
			message: 'USER_NOT_FOUND',
		};
	}

	public async confirmPasswordReset(hashPassword: string, token: string): Promise<void> {
		const result = await this.verifyValidPasswordResetToken(token);

		if (result.success) {
			await this.userRepository.updateUserPassword(hashPassword, token);
		} else {
			throw new UserError(`Failed to confirm password reset`, result.message);
		}
	}
}
