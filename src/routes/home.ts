import express from 'express';

import { database } from '../db/postgresconnection';
import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import WishCardsRepository from '../db/repository/postgres/WishCardsRepository';

const router = express.Router();

const wishcardsRepository = new WishCardsRepository(database);
const agenciesRepository = new AgenciesRepository(database);

router.get('/', async (_req, res, _next) => {
    const undonatedCards = (await wishcardsRepository.getByStatus('published')).length;
    const donatedCards = (await wishcardsRepository.getByStatus('donated')).length;
    const verifiedAgencies = (await agenciesRepository.getByVerificationStatus(true)).length;

    return res.render('pages/home', {
        undonatedCards,
        donatedCards,
        verifiedAgencies,
    });
});

export default router;
