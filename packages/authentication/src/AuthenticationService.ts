import { injectable } from 'inversify';
import { UserRepository } from '@donategifts/user-data';
import { compare } from 'bcrypt';
import { IUser, LoginMode, UserRoles } from '@donategifts/common';
import { createEmailVerificationHash, logger, sendVerificationEmail } from '@donategifts/helper';
import {
	createDefaultPassword,
	hashPassword,
	validateReCaptchaToken,
	verifyGoogleToken,
} from './helper/authenticationHelper';
import { GoogleAuthError } from './helper/GoogleAuthError';
import { FacebookAuthError } from './helper/FacebookAuthError';
import { SignupError } from './helper/SignupError';
import { LoginError } from './helper/LoginError';

@injectable()
export class AuthenticationService {
	constructor(private userRepository: typeof UserRepository = UserRepository) {}

	public async googleSignIn(idToken: string): Promise<IUser> {
		if (idToken) {
			const user = await verifyGoogleToken(idToken);
			const fName = user.firstName;
			const lName = user.lastName;
			const email = user.mail?.toLowerCase();

			if (!email || !fName) {
				throw new GoogleAuthError('Failed to retrieve email from google!');
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

	public async facebookSignIn(userName: string, email: string): Promise<IUser> {
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

		throw new FacebookAuthError('Username/Email not provided!');
	}

	public async signupUser(userData: IUser, captchaToken: string): Promise<IUser> {
		const isCaptchaValid = await validateReCaptchaToken(captchaToken);

		if (!isCaptchaValid) {
			throw new SignupError('Provided captcha token is invalid!');
		}

		if (userData.email) {
			const candidate = await this.userRepository.getUserByEmail(userData.email);
			if (candidate) {
				throw new SignupError('Email already taken!');
			}
		}

		const hashedPassword = await hashPassword(userData.password);
		const verificationHash = createEmailVerificationHash();

		const user = await this.userRepository.createNewUser({
			...userData,
			verificationHash,
			password: hashedPassword,
			loginMode: LoginMode.Default,
		});

		// trying to add a second step here
		// if the userRole is partner then redirect to agency.ejs then profile.ejs

		const emailResponse = await sendVerificationEmail(user.email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (process.env.NODE_ENV === 'development') {
			logger.info(response);
		}

		return user;
	}

	public async login(email: string, password: string): Promise<IUser> {
		const user = await this.userRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await compare(password, user.password)) {
				return user;
			}

			throw new LoginError('Password does not match!');
		}
		throw new LoginError('No user found!');
	}
}
