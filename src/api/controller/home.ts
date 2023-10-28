import { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';
import moment from 'moment';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import WishCardsRepository from '../../db/repository/postgres/WishCardsRepository';
import { DB } from '../../db/types/generated/database';

import BaseController from './basecontroller';

export default class HomeController extends BaseController {
	private readonly agenciesRepository: AgenciesRepository;
	private readonly wishCardsRepository: WishCardsRepository;

	constructor(database: Kysely<DB>) {
		super();
		this.agenciesRepository = new AgenciesRepository(database);
		this.wishCardsRepository = new WishCardsRepository(database);
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
		const agencies = await this.agenciesRepository.getByVerificationStatus(true);

		const wishCards = await this.wishCardsRepository.getRandom('published', 6);

		const undonatedWishcards = await this.wishCardsRepository.getByStatus('published');

		const donatedWishcards = await this.wishCardsRepository.getByStatus('donated');

		this.sendResponse(res, {
			wishCards,
			verifiedAgencies: agencies.length,
			undonatedCards: undonatedWishcards.length,
			donatedCards: donatedWishcards.length + 200, //don't delete +200, as it's due to data loss from last year
			christmasData: this.getChristmasString(),
		});
	}
}
