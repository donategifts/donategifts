import {
	IUser,
	IWishCard,
	LoginMode,
	ObjectId,
	TypeObjectId,
	UserRoles,
} from '@donategifts/common';
import { AgencyRepository } from '@donategifts/agency';
import { WishCardRepository } from '@donategifts/wishcard';
import { compare } from 'bcrypt';
import { inject, injectable } from 'inversify';
import {
	createDefaultPassword,
	createEmailVerificationHash,
	hashPassword,
	logger,
	sendVerificationEmail,
	validateReCaptchaToken,
	verifyGoogleToken,
} from '@donategifts/helper';
import { UserRepository } from './database/UserRepository';

@injectable()
export class UserService {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		private agencyRepository: typeof AgencyRepository = AgencyRepository,
		private wishCardRepository: typeof WishCardRepository = WishCardRepository,
	) {}

	private async sendMail(email, verificationHash) {
		const emailResponse = await sendVerificationEmail(email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (process.env.NODE_ENV === 'development') {
			logger.info(response);
		}
	}

	public async getUsers(): Promise<IUser[]> {
		return this.userRepository.getUsers();
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

	public async signupUser(
		user: Omit<IUser, '_id'>,
		captchaToken: string,
	): Promise<{ newUser: IUser; url: string }> {
		const isCaptchaValid = await validateReCaptchaToken(captchaToken);

		if (!isCaptchaValid) {
			throw new Error('Provided captcha token is invalid!');
		}

		if (user.email) {
			const candidate = await this.userRepository.getUserByEmail(user.email);
			if (candidate) {
				throw new Error('Email already taken!');
			}
		}

		const hashedPassword = await hashPassword(user.password);
		const verificationHash = createEmailVerificationHash();

		const newUser = await this.userRepository.createNewUser({
			...user,
			verificationHash,
			password: hashedPassword,
			loginMode: LoginMode.Default,
		});

		// trying to add a second step here
		// if the userRole is partner then redirect to agency.ejs then profile.ejs

		await this.sendMail(user.email, verificationHash);
		let url;
		if (newUser.userRole === 'partner') {
			url = '/users/agency';
		} else {
			url = '/users/profile';
		}
		return {
			newUser,
			url,
		};
	}

	public async googleSignUp(idToken: string): Promise<IUser> {
		if (idToken) {
			const user = await verifyGoogleToken(idToken);
			const fName = user.firstName;
			const lName = user.lastName;
			const email = user.mail?.toLowerCase();

			if (!email || !fName) {
				throw new Error('Failed to retrieve email from google!');
			}

			const dbUser = await this.userRepository.getUserByEmail(email);

			if (dbUser) {
				return dbUser;
			}

			return this.userRepository.createNewUser({
				fName,
				lName,
				email,
				password: createDefaultPassword(),
				verificationHash: createEmailVerificationHash(),
				userRole: UserRoles.Donor,
				loginMode: LoginMode.Google,
				emailVerified: true,
			} as IUser);
		}

		throw new Error('No googleSignup token provided!');
	}

	public async facebookSignUp(userName: string, email: string): Promise<IUser> {
		if (userName && email) {
			const [fName, lName] = userName.split(' ');

			const dbUser = await this.userRepository.getUserByEmail(email);

			if (dbUser) {
				return dbUser;
			}

			return this.userRepository.createNewUser({
				fName,
				lName: lName || 'LastnameUnset',
				email: email.toLowerCase(),
				password: createDefaultPassword(),
				verificationHash: createEmailVerificationHash(),
				userRole: UserRoles.Donor,
				loginMode: LoginMode.Facebook,
				emailVerified: true,
			} as IUser);
		}

		throw new Error('Username/Email not provided!');
	}

	public async login(email: string, password: string): Promise<IUser> {
		const user = await this.userRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await compare(password, user.password)) {
				return user;
			}

			throw new Error('Password does not match!');
		}
		throw new Error('No user found!');
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
