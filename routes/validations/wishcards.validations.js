const { body, validationResult } = require('express-validator');

const createWishcardValidationRules = () => {
  return [
    body('childBirthday').notEmpty().isString(),
    body('wishItemPrice').notEmpty().isString(),
    body('childFirstName').notEmpty().isString(),
    body('childLastName').notEmpty().isString(),
    body('childInterest').notEmpty().isString(),
    body('wishItemName').notEmpty().isString(),
    body('wishItemPrice').notEmpty().isString(),
    body('wishItemURL').notEmpty().isString(),
    body('childStory').notEmpty().isString()
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      error: errors.array({ onlyFirstError: true })
    });
  }
  next();
};

module.exports = {
  createWishcardValidationRules,
  validate
};
