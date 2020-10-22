const { body, validationResult, param } = require('express-validator');
const UserRepository = require('../../db/repository/UserRepository');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const { getMessageChoices } = require('../../utils/defaultMessages');
const { handleError } = require('../../helper/error');
const { log } = require('../../helper/logger');

const createWishcardValidationRules = () => {
  return [
    body('childBirthday').notEmpty().isString(),
    body('childFirstName').notEmpty().isString(),
    body('childLastName').notEmpty().isString(),
    body('childInterest').notEmpty().isString(),
    body('wishItemName').notEmpty().isString(),
    body('wishItemPrice').notEmpty().isNumeric(),
    body('wishItemURL').notEmpty().isString(),
    body('childStory').notEmpty().isString(),
  ];
};

const createGuidedWishcardValidationRules = () => {
  return [
    body('itemChoice').custom((itemChoice) => {
      const item = JSON.parse(itemChoice);
      const { Name, Price, ItemURL } = item;
      if (!Name || !Price || !ItemURL) {
        throw new Error('Missing items');
      } else if (typeof Name !== 'string') {
        throw new Error('ItemChoice Name - Wrong fieldtype');
      } else if (typeof Price !== 'number') {
        throw new Error('ItemChoice Price - Wrong fieldtype');
      } else if (typeof ItemURL !== 'string') {
        throw new Error('ItemChoice String - Wrong fieldtype');
      }
      return true;
    }),
    body('childBirthday').notEmpty().isString(),
    body('childFirstName').notEmpty().isString(),
    body('childLastName').notEmpty().isString(),
    body('childInterest').notEmpty().isString(),
    body('childStory').notEmpty().isString(),
  ];
};

const searchValidationRules = () => {
  return [body('wishitem').notEmpty()];
};

const getByIdValidationRules = () => {
  return [param('id').notEmpty()];
};

const updateWishCardValidationRules = () => {
  return [param('id').notEmpty()];
};

const postMessageValidationRules = () => {
  return [
    body('messageFrom')
      .notEmpty()
      .custom(async (value) => {
        const foundUser = await UserRepository.getUserByObjectId(value._id);
        if (!foundUser) {
          throw new Error('User Error - User not found');
        }
        return true;
      }),
    body('messageTo')
      .notEmpty()
      .custom(async (value) => {
        const foundWishcard = await WishCardRepository.getWishCardByObjectId(value._id);
        if (!foundWishcard) {
          throw new Error('Wishcard Error - Wishcard not found');
        }
      }),
    body('message')
      .notEmpty()
      .custom((value, { req }) => {
        const { messageFrom: user, messageTo: wishcard } = req.body;
        const allMessages = getMessageChoices(user.fName, wishcard.childFirstName);
        if (!allMessages.includes(value)) {
          throw new Error('Messages Error - Message Choice not found');
        }
        return true;
      }),
  ];
};

const getDefaultCardsValidationRules = () => {
  return [param('id').notEmpty()];
};

const lockWishCardValidationRules = () => {
  return [param('id').notEmpty()];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log(res, errors);
    return handleError(res, 400, errors.array({ onlyFirstError: true })[0]);
  }
  next();
};

module.exports = {
  createWishcardValidationRules,
  createGuidedWishcardValidationRules,
  searchValidationRules,
  getByIdValidationRules,
  updateWishCardValidationRules,
  postMessageValidationRules,
  getDefaultCardsValidationRules,
  lockWishCardValidationRules,
  validate,
};
