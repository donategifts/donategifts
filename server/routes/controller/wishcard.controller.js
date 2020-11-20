const moment = require('moment');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const UserRepository = require('../../db/repository/UserRepository');

async function getWishCardSearchResult(itemName, showDonated = false, limit = 25, childAge, cardIds) {
  const fuzzySearchResult = await WishCardRepository.getWishCardsFuzzy(
    (itemName && itemName.trim()) || '',
    showDonated,
    limit,
    cardIds,
  );

  // remove duplicates
  const allWishCards = fuzzySearchResult.filter((elem, index, self) => {
    return index === self.indexOf(elem);
  });

  for (let i = 0; i < allWishCards.length; i++) {
    let childBirthday;

    if (allWishCards[i].childBirthday) {
      childBirthday = allWishCards[i].childBirthday;
    } else {
      childBirthday = new Date();
    }

    const birthday = moment(childBirthday);
    const today = moment(new Date());

    allWishCards[i].age = today.diff(birthday, 'year');
  }

  if (showDonated || !childAge) {
    return allWishCards;
  }

  return allWishCards.filter((item) => (childAge < 15 ? item.age < childAge : item.age >= childAge));
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
  response.alreadyLockedWishCard = await WishCardRepository.getLockedWishcardsByUserId(req.session.user._id);

  return response;
}

module.exports = {
  getLockedWishCards,
  getWishCardSearchResult,
};
