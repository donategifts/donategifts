import { Body, Controller, Get, Post, Route, Security, Request, Response } from '@tsoa/runtime';

@Route('/agency')
export class AgencyController extends Controller {
	@Response('400', 'Bad request')
	@Post('/agency')
	public async createAgency(@Body() _body: any): Promise<void> {
		// TODO: implementation needed
	}

	@Response('400', 'Bad request')
	@Get('/agency/wish-card')
	@Security('WEBSITE-BASIC')
	public async getAgencyWishCards(@Request() _req: any): Promise<void> {
		// TODO: implementation needed
	}
}
