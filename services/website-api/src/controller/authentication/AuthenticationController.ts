import { AuthenticationService } from '@donategifts/authentication';
import { Controller, Post, Route, Tags, Response, Body } from '@tsoa/runtime';
import { IUser, ObjectId } from '@donategifts/common';
// import * as express from 'express';
import { IAPIUser } from '../user/types/IAPIUser';

@Route('/auth')
@Tags('authentication')
export class AuthenticationController extends Controller {
	constructor(private authenticationService: typeof AuthenticationService = AuthenticationService) {
		super();
	}

	@Response('400', 'Bad request')
	@Post('/signup')
	public async signup(
		@Body() body: { userData: IAPIUser; captchaToken: string },
	): Promise<IAPIUser> {
		return this.authenticationService.signupUser(
			{
				...body.userData,
				_id: ObjectId<IUser>(body.userData._id),
			},
			body.captchaToken,
		);
	}

	@Response('400', 'Bad request')
	@Post('/google')
	public async google(@Body() body: { idToken: string }): Promise<IAPIUser> {
		return this.authenticationService.googleSignIn(body.idToken);
	}

	@Response('400', 'Bad request')
	@Post('/facebook')
	public async facebook(@Body() body: { userName: string; email: string }): Promise<IAPIUser> {
		return this.authenticationService.facebookSignIn(body.userName, body.userName);
	}

	@Response('400', 'Bad request')
	@Post('/login')
	public async login(@Body() body: { email: string; password: string }): Promise<IAPIUser> {
		return this.authenticationService.login(body.email, body.password);
	}

	// @Response('400', 'Bad request')
	// @Post('/logout')
	// public async logout(
	// 	@Request() req: express.Request,
	// 	@Res() res: express.Response,
	// ): Promise<void> {
	// 	req.session.destroy(() => {
	// 		res.clearCookie(process.env.SESS_NAME!);
	// 	});
	// }
}
