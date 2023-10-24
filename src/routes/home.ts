import express from 'express';

import { database } from '../db/postgresconnection';
import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import WishCardsRepository from '../db/repository/postgres/WishCardsRepository';

const router = express.Router();

router.get('/', async (_req, res, _next) => {
	const undonatedCards = (await new WishCardsRepository(database).getByStatus('published'))
		.length;
	const donatedCards = (await new WishCardsRepository(database).getByStatus('donated')).length;
	const verifiedAgencies = (await new AgenciesRepository(database).getByVerificationStatus(true))
		.length;

	return res.render('pages/home', {
		undonatedCards,
		donatedCards,
		verifiedAgencies,
	});
});

export default router;
