import { injectable } from 'inversify';
import { DBUser, User as IUser, UserUpdateInput, UserCreateInput } from './DBUser';

@injectable()
export class UserRepository {
	public async getUserById(id: number): Promise<IUser | null> {
		return DBUser.findUnique({
			where: { id },
		});
	}

	public async updateUserById(id: number, updateParams: UserUpdateInput): Promise<IUser> {
		return DBUser.update({
			where: { id },
			data: updateParams,
		});
	}

	public async getUserByEmail(email: string): Promise<IUser | null> {
		return DBUser.findUnique({
			where: { email },
		});
	}

	public async getUserByVerificationHash(emailVerificationHash: string): Promise<IUser | null> {
		return DBUser.findUnique({
			where: { emailVerificationHash },
		});
	}

	public async createNewUser(params: UserCreateInput): Promise<IUser> {
		return DBUser.create({
			data: params,
		});
	}

	public async getUserByPasswordResetToken(tokenId: string): Promise<IUser | null> {
		return DBUser.findUnique({
			where: { passwordResetToken: tokenId },
		});
	}

	public async setUserEmailVerification(id: number, verified: boolean): Promise<IUser | null> {
		return DBUser.update({
			where: { id },
			data: { emailVerified: verified },
		});
	}

	public async setPasswordResetToken(
		email: string,
		passwordResetToken: string,
		passwordResetTokenExpires: Date,
	): Promise<IUser | null> {
		return DBUser.update({
			where: { email },
			data: { passwordResetToken, passwordResetTokenExpires },
		});
	}

	public async updateUserPassword(hashPassword: string, token: string): Promise<IUser | null> {
		return DBUser.update({
			where: { passwordResetToken: token },
			data: {
				password: hashPassword,
				passwordResetToken: undefined,
				passwordResetTokenExpires: undefined,
			},
		});
	}
}
