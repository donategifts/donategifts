const express = require('express');

const router = express.Router();

const moment = require('moment');

const AgencyRepository = require('../db/repository/AgencyRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

function getChristmasString() {

  const christmas = moment([2020, 11, 25]);
  const today = moment();

  const daysTillChristmas = christmas.diff(today, 'days');

  const christmasData = {};
  christmasData.days = daysTillChristmas;

  if (daysTillChristmas > 1) {
    christmasData.text = `DAYS UNTIL CHRISTMAS DONATIONS CLOSE`;
  } else if (daysTillChristmas === 1) {
    christmasData.text = `DAY UNTIL CHRISTMAS DONATIONS CLOSE`;
  } else {
    christmasData.text = `MERRY CHRISTMAS`;
  }

  return christmasData;

}

router.get('/', async (_req, res) => {

  const agencies = await AgencyRepository.getVerifiedAgencies();
  const undonatedWishcards = await  WishCardRepository.getWishCardsByStatus('published');

  res.render('home', {
    user: res.locals.user,
    wishcards: [],
    verifiedAgencies: agencies.length,
    undonatedCards: undonatedWishcards.length,
    christmasData: getChristmasString()
  });
});




module.exports = router;
