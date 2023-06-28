const moment = require('moment');
const BaseController = require('./basecontroller');
const AgencyRepository = require('../db/repository/AgencyRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

module.exports = class HomeController extends BaseController {
	#agencyRepository;

	#wishCardRepository;

	constructor() {
		super();
		this.#agencyRepository = new AgencyRepository();
		this.#wishCardRepository = new WishCardRepository();

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

	async handleGetIndex(_req, res, _next) {
		const agencies = await this.#agencyRepository.getVerifiedAgencies();

		const undonatedWishcards = await this.#wishCardRepository.getWishCardsByStatus('published');

		const donatedWishcards = await this.#wishCardRepository.getWishCardsByStatus('donated');

		this.renderView(res, 'home', {
			wishcards: [],
			verifiedAgencies: agencies.length,
			undonatedCards: undonatedWishcards.length,
			donatedCards: Number(donatedWishcards.length) + 200,
			christmasData: this.#getChristmasString(),
		});
	}
};
