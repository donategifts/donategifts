const express = require('express');

const router = express.Router();

const moment = require('moment');

const AgencyRepository = require('../db/repository/AgencyRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

function getChristmasString() {
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

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/', async (_req, res) => {
  const agencies = await AgencyRepository.getVerifiedAgencies();

  const undonatedWishcards = await WishCardRepository.getWishCardsByStatus('published');

  const donatedWishcards = await WishCardRepository.getWishCardsByStatus('donated');

  res.render('home', {
    user: res.locals.user,
    wishcards: [],
    verifiedAgencies: agencies.length,
    undonatedCards: undonatedWishcards.length,
    donatedCards: donatedWishcards.length,
    christmasData: getChristmasString(),
  });
});

module.exports = router;
