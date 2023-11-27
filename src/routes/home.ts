import express from 'express';

import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import WishCardsRepository from '../db/repository/postgres/WishCardsRepository';

const router = express.Router();

router.get('/', async (_req, res, _next) => {
    const undonatedCards = (await WishCardsRepository.getByStatus('published')).length;
    const donatedCards = (await WishCardsRepository.getByStatus('donated')).length;
    const verifiedAgencies = (await AgenciesRepository.getByVerificationStatus(true)).length;

    return res.render('pages/home', {
        undonatedCards,
        donatedCards,
        verifiedAgencies,
    });
});

export default router;
