const { body, validationResult, param } = require('express-validator');
const UserRepository = require('../../db/repository/UserRepository');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const { getMessageChoices } = require('../../utils/defaultMessages');
const { handleError } = require('../../helper/error');
const { log } = require('../../helper/logger');

const createWishcardValidationRules = () => {
  return [
    body('childBirthday').isString(),
    body('childFirstName').notEmpty().withMessage("Child's first Name is required").isString(),
    body('childLastName').isString(),
    body('childInterest').isString(),
    body('wishItemName').notEmpty().withMessage('Wish item name is required').isString(),
    body('wishItemPrice').notEmpty().withMessage('Wish item price is required').isNumeric(),
    body('wishItemURL').notEmpty().withMessage('Wish item url is required').isString(),
    body('childStory').notEmpty().withMessage("Child's story is required").isString(),
  ];
};

const createGuidedWishcardValidationRules = () => {
  return [
    body('itemChoice')
      .isJSON()
      .withMessage('Must select an option')
      .custom((itemChoice) => {
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
    body('childBirthday').isString(),
    body('childFirstName').notEmpty().withMessage("Child's first Name is required").isString(),
    body('childLastName').isString(),
    body('childInterest').isString(),
    body('childStory').notEmpty().withMessage("Child's story is required").isString(),
  ];
};

const searchValidationRules = () => {
  return [body('wishitem').notEmpty().withMessage('Wishitem is required')];
};

const getByIdValidationRules = () => {
  return [param('id').notEmpty().withMessage('Id parameter is required')];
};

const updateWishCardValidationRules = () => {
  return [param('id').notEmpty().withMessage('Id parameter is required')];
};

const postMessageValidationRules = () => {
  return [
    body('messageFrom')
      .notEmpty()
      .withMessage('Message From - User is required')
      .custom(async (value) => {
        const foundUser = await UserRepository.getUserByObjectId(value._id);
        if (!foundUser) {
          throw new Error('User Error - User not found');
        }
        return true;
      }),
    body('messageTo')
      .notEmpty()
      .withMessage('Message To - Wishcard is required')
      .custom(async (value) => {
        const foundWishcard = await WishCardRepository.getWishCardByObjectId(value._id);
        if (!foundWishcard) {
          throw new Error('Wishcard Error - Wishcard not found');
        }
      }),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .custom((value, { req }) => {
        const { messageFrom: user, messageTo: wishcard } = req.body;
        const allMessages = getMessageChoices(user.fName, wishcard.childFirstName);
        if (!allMessages.includes(value)) {
          throw new Error('Message Error - Message Choice not found');
        }
        return true;
      }),
  ];
};

const getDefaultCardsValidationRules = () => {
  return [param('id').notEmpty().withMessage('Id parameter is required')];
};

const lockWishCardValidationRules = () => {
  return [param('id').notEmpty().withMessage('Id parameter is required')];
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
