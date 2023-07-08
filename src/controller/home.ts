import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import AgencyRepository from '../db/repository/AgencyRepository';
import WishCardRepository from '../db/repository/WishCardRepository';

import BaseController from './basecontroller';

export default class HomeController extends BaseController {
	private agencyRepository: AgencyRepository;

	private wishCardRepository: WishCardRepository;

	constructor() {
		super();
		this.agencyRepository = new AgencyRepository();
		this.wishCardRepository = new WishCardRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	private getChristmasString() {
		const christmas = moment([2021, 11, 25]);
		const today = moment();
		const daysTillChristmas = christmas.diff(today, 'days');

		const christmasData: {
			days: number;
			text?: string;
		} = {
			days: daysTillChristmas,
		};

		if (daysTillChristmas > 1) {
			christmasData.text = `DAYS UNTIL THE LAST DAY OF CHRISTMAS DONATIONS`;
		} else if (daysTillChristmas === 1) {
			christmasData.text = `DAY UNTIL THE LAST DAY OF CHRISTMAS DONATIONS`;
		} else {
			christmasData.text = `CHRISTMAS DONATIONS ENDED`;
		}

		return christmasData;
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		const agencies = await this.agencyRepository.getVerifiedAgencies();

		const undonatedWishcards = await this.wishCardRepository.getWishCardsByStatus('published');

		const donatedWishcards = await this.wishCardRepository.getWishCardsByStatus('donated');

		this.renderView(res, 'home', {
			wishcards: [],
			verifiedAgencies: agencies.length,
			undonatedCards: undonatedWishcards.length,
			donatedCards: Number(donatedWishcards.length) + 200,
			christmasData: this.getChristmasString(),
		});
	}
}
