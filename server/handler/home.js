const moment = require('moment');
const BaseHandler = require('./basehandler');
const { AgencyRepository } = require('../db/repository/AgencyRepository');
const { WishCardRepository } = require('../db/repository/WishCardRepository');

module.exports = class HomeHandler extends BaseHandler {
	#agencyRepository;

	#wishCardRepository;

	constructor() {
		super();
		this.#agencyRepository = new AgencyRepository();
		this.#wishCardRepository = new WishCardRepository();

		this.handleGetHealth = this.handleGetHealth.bind(this);
		this.handleGetIndex = this.handleGetIndex.bind(this);
	}

	#getChristmasString() {
		const christmas = moment([2021, 11, 25]);
		const today = moment();
		const daysTillChristmas = christmas.diff(today, 'days');

		const christmasData = {};
		christmasData.days = daysTillChristmas;

		if (daysTillChristmas > 1) {
			christmasData.text = `DAYS UNTIL THE LAST DAY OF CHRISTMAS DONATIONS`;
		} else if (daysTillChristmas === 1) {
			christmasData.text = `DAY UNTIL THE LAST DAY OF CHRISTMAS DONATIONS`;
		} else {
			christmasData.text = `CHRISTMAS DONATIONS ENDED`;
		}

		return christmasData;
	}

	handleGetHealth(_req, res, _next) {
		res.json({ status: 'ok' });
	}

	async handleGetIndex(_req, res, _next) {
		const agencies = await this.#agencyRepository.getVerifiedAgencies();

		const undonatedWishcards = await this.#wishCardRepository.getWishCardsByStatus('published');

		const donatedWishcards = await this.#wishCardRepository.getWishCardsByStatus('donated');

		// remove this after pug rewrite, just used to test new pages on index page
		const page = 'pages/home';

		res.render(page, {
			user: res.locals.user,
			wishcards: [],
			verifiedAgencies: agencies.length,
			undonatedCards: undonatedWishcards.length,
			donatedCards: Number(donatedWishcards.length) + 200,
			christmasData: this.#getChristmasString(),
		});
	}
};
