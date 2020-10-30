const moment = require('moment');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const UserRepository = require('../../db/repository/UserRepository');

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

async function getLockedWishCards(req) {
  const response = {
    wishCardId: req.params.id,
  };

  if (!req.session.user) {
    response.error = 'User not found';
    return response;
  }

  const user = await UserRepository.getUserByObjectId(req.session.user._id);
  if (!user) {
    response.error = 'User not found';
    return response;
  }
  response.userId = user._id;
  response.alreadyLockedWishCard = await WishCardRepository.getLockedWishcardsByUserId(
    req.session.user._id,
  );

  return response;
}

module.exports = {
  getLockedWishCards,
  getWishCardSearchResult,
};
