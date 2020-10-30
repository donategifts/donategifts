const moment = require('moment');
const WishCardRepository = require('../../db/repository/WishCardRepository');

async function getWishCardSearchResult(
  itemName,
  recent = true,
  active = false,
  childAge = 15,
  limit = 25,
) {
  let activeCardsOnly = active;
  if (childAge < 15) {
    activeCardsOnly = true;
  }

  const itemNameResult =
    (await WishCardRepository.getWishCardsByItemName(itemName, recent, activeCardsOnly, limit)) ||
    [];

  const fuzzySearchResult =
    (await WishCardRepository.getWishCardsFuzzy(itemName, recent, activeCardsOnly, limit)) || [];

  // remove duplicates
  const allWishCards = [...new Set([...itemNameResult, ...fuzzySearchResult])];

  for (let i = 0; i < allWishCards.length; i++) {
    const birthday = moment(new Date(allWishCards[i].childBirthday));
    const today = moment(new Date());

    allWishCards[i].age = today.diff(birthday, 'years');
  }

  return allWishCards.filter((item) => (childAge < 15 ? item.age < childAge : item.age > childAge));
}

module.exports = {
  getWishCardSearchResult,
};
