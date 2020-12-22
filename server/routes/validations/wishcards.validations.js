const { body, validationResult, param } = require('express-validator');
const UserRepository = require('../../db/repository/UserRepository');
const WishCardRepository = require('../../db/repository/WishCardRepository');
const { getMessageChoices } = require('../../utils/defaultMessages');
const { handleError } = require('../../helper/error');

const createWishcardValidationRules = () => {
  return [
    body('childBirthday').isString(),
    body('childFirstName').notEmpty().withMessage("Child's first Name is required").isString(),
    body('childLastName').isString(),
    body('childInterest').isString(),
    body('wishItemName').notEmpty().withMessage('Wish item name is required').isString(),
    body('wishItemPrice').notEmpty().withMessage('Wish item price is required').isNumeric(),
    body('wishItemURL')
      .notEmpty()
      .withMessage('Wish item url is required')
      .isString()
      // https://regex101.com/r/yM5lU0/13 if you want to see it in action
      .matches(/^(https(:\/\/)){1}([w]{3})(\.amazon\.com){1}\/.*$/)
      .withMessage('Wish item url has to be a valid amazon link!'),
    body('childStory').notEmpty().withMessage("Child's story is required").isString(),
    body('address1')
      .notEmpty()
      .withMessage('Address cannot be empty')
      .isLength({min: 5 })
      .withMessage('Address must contain at least 5 characters'),
    body('address2').optional(),
    body('address_city')
      .notEmpty()
      .withMessage('City cannot be empty')
      .isLength({min: 2 })
      .withMessage('City must contain at least 2 characters'),
    body('address_state')
      .notEmpty()
      .withMessage('State cannot be empty')
      .isLength({min: 2 })
      .withMessage('State must contain at least 2 characters'),
    body('address_country')
      .notEmpty()
      .withMessage('Country cannot be empty')
      .isLength({min: 2 })
      .withMessage('Country must contain at least 2 characters'),
    body('address_zip')
      .notEmpty()
      .withMessage('Zip cannot be empty')
      .isLength({min: 5 })
      .withMessage('Zipcode must contain at least 5 characters'),
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
    body('address1')
      .notEmpty()
      .withMessage('Address cannot be empty')
      .isLength({min: 5 })
      .withMessage('Address must contain at least 5 characters'),
    body('address2').optional(),
    body('address_city')
      .notEmpty()
      .withMessage('City cannot be empty')
      .isLength({min: 2 })
      .withMessage('City must contain at least 2 characters'),
    body('address_state')
      .notEmpty()
      .withMessage('State cannot be empty')
      .isLength({min: 2 })
      .withMessage('State must contain at least 2 characters'),
    body('address_country')
      .notEmpty()
      .withMessage('Country cannot be empty')
      .isLength({min: 2 })
      .withMessage('Country must contain at least 2 characters'),
    body('address_zip')
      .notEmpty()
      .withMessage('Zip cannot be empty')
      .isLength({min: 5 })
      .withMessage('Zipcode must contain at least 5 characters'),
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
      .withMessage('messaging From - User is required')
      .custom(async (value) => {
        const foundUser = await UserRepository.getUserByObjectId(value._id);
        if (!foundUser) {
          throw new Error('User Error - User not found');
        }
        return true;
      }),
    body('messageTo')
      .notEmpty()
      .withMessage('messaging To - Wishcard is required')
      .custom(async (value) => {
        const foundWishcard = await WishCardRepository.getWishCardByObjectId(value._id);
        if (!foundWishcard) {
          throw new Error('Wishcard Error - Wishcard not found');
        }
      }),
    body('message')
      .notEmpty()
      .withMessage('messaging is required')
      .custom((value, { req }) => {
        const { messageFrom: user, messageTo: wishcard } = req.body;
        const allMessages = getMessageChoices(user.fName, wishcard.childFirstName);
        if (!allMessages.includes(value)) {
          throw new Error('messaging Error - messaging Choice not found');
        }
        return true;
      }),
  ];
};

const getDefaultCardsValidationRules = () => {
  return [param('id').notEmpty().withMessage('Id parameter is required')];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
  validate,
};
