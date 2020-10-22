const { body, validationResult, param } = require('express-validator');
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
    body('itemChoice.Name').notEmpty().isString(),
    body('itemChoice.Price').notEmpty().isNumeric(),
    body('itemChoice.ItemURL').notEmpty().isString(),
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
  return [body('messageFrom').notEmpty(), body('messageTo').notEmpty(), body('message').notEmpty()];
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
