const moment = require('moment');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const UserRepository = require('../../db/repository/UserRepository');

async function getWishCardSearchResult(itemName, isDonated = false, limit = 25, childAge = 15) {
  if (childAge < 15) {
    // eslint-disable-next-line no-param-reassign
    isDonated = true;
  }

  const fuzzySearchResult = await WishCardRepository.getWishCardsFuzzy(
    itemName.trim(),
    isDonated,
    limit,
  );

  // remove duplicates
  const allWishCards = fuzzySearchResult.filter((elem, index, self) => {
    return index === self.indexOf(elem);
  });

  for (let i = 0; i < allWishCards.length; i++) {
    const birthday = moment(new Date(allWishCards[i].childBirthday));
    const today = moment(new Date());

    allWishCards[i].age = today.diff(birthday, 'years');
  }

  return allWishCards;
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
