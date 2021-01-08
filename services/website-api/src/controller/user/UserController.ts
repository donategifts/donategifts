import {
	Controller,
	Get,
	Post,
	Put,
	Response,
	Route,
	Body,
	Query,
	Security,
	Tags,
} from '@tsoa/runtime';
import { UserService } from '@donategifts/user';
import { StorageService } from '@donategifts/storage';
import { IUser, ObjectId } from '@donategifts/common';
import { hashPassword } from '@donategifts/authentication';
import { IAPIUser, IUserUpdateParams } from './types/IAPIUser';

// TODO: check old routes for params like res, req, and additional query params

@Route('/user')
@Tags('user')
export class User extends Controller {
	constructor(
		private userService: typeof UserService = UserService,
		private storageService: typeof StorageService = StorageService,
	) {
		super();
	}

	@Response('400', 'Bad request')
	@Put('/profile')
	@Security('WEBSITE-BASIC')
	public async updateProfile(
		@Body() body: { userId: string; updateData: IUserUpdateParams },
	): Promise<IAPIUser> {
		const { userId, updateData } = body;

		let imageUrl = '';

		if (updateData.profileImage) {
			imageUrl = await this.storageService.upload(updateData.profileImage);
		}

		const data = {
			...updateData,
			profileImage: imageUrl,
		};

		return this.userService.updateUserData(ObjectId<IUser>(userId), data);
	}

	@Response('400', 'Bad request')
	@Get('/verify')
	public async verify(@Query() hash: string): Promise<IAPIUser> {
		return this.userService.verifyUserEmail(hash);
	}

	@Response('400', 'Bad request')
	@Post('/password/request')
	public async requestPasswordReset(@Body() body: { email: string }): Promise<void> {
		await this.userService.requestPasswordReset(body.email);
	}

	@Response('400', 'Bad request')
	@Get('/password/reset')
	public async verifyValidPasswordResetToken(
		@Query() token: string,
	): Promise<{ success: boolean; message?: string }> {
		return this.userService.verifyValidPasswordResetToken(token);
	}

	@Response('400', 'Bad request')
	@Post('/password/reset')
	public async confirmPasswordReset(
		@Body() body: { password: string; token: string },
	): Promise<void> {
		const { password, token } = body;

		const hash = await hashPassword(password);

		await this.userService.confirmPasswordReset(hash, token);
	}
}
