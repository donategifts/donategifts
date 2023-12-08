import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

import BaseController from './basecontroller';

export default class TeamController extends BaseController {
	constructor() {
		super();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		let contributors: {
			name: string;
			avatarUrl: string;
			githubProfile: string;
		}[] = [];

		try {
			const { data } = await axios.get(
				'https://api.github.com/repos/donategifts/donategifts/contributors?anon=1',
			);

			contributors = data
				.filter((user) => user.type !== 'Bot' && user.type !== 'Anonymous')
				.map((contributor: any) => {
					return {
						name: contributor.login,
						avatarUrl: contributor.avatar_url,
						githubProfile: contributor.html_url,
					};
				});
		} catch (error) {
			this.log.error(error);
		}

		return this.renderView(res, 'team', { contributors });
	}
}
