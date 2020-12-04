const express = require('express');

const router = express.Router();
const log = require('../helper/logger');

const WishCardRepository = require('../db/repository/WishCardRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');

// Renders data to homepage on sats section.

router.get('/', async (req, res) => {
  try {
    const wCards = await WishCardRepository.getNotDonatedCards();
    const cardsNeedDonations = wCards.length;

    const verifiedAgencies = await AgencyRepository.getAllVerifiedAgencies();
    const totalAgencies = verifiedAgencies.length;
    res.render('home', { cardsNeedDonations, totalAgencies });
  } catch (error) {
    log.error(req, error);
  }
});

module.exports = router;
