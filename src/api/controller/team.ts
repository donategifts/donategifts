import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

import BaseController from './basecontroller';

export default class TeamController extends BaseController {
	public async handleGetGithubContributors(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { data } = await axios.get(
				'https://api.github.com/repos/donategifts/donategifts/contributors?anon=1',
			);

			const contributors: {
				name: string;
				avatarUrl: string;
				githubProfile: string;
			}[] = data
				.filter((user) => user.type !== 'Bot' && user.type !== 'Anonymous')
				.map((contributor: any) => {
					return {
						name: contributor.login,
						avatarUrl: contributor.avatar_url,
						githubProfile: contributor.html_url,
					};
				});

			return this.sendResponse(res, contributors);
		} catch (error) {
			this.log.error(error);
			return this.sendResponse(res, 'Internal Server Error', 500);
		}
	}
}
