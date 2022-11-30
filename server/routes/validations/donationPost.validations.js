const { body, validationResult } = require('express-validator');
const { handleError } = require('../../helper/error');

const donationPostValidation = () => [
  body('postText')
    .notEmpty()
    .withMessage('Message can not be empty')
    .isLength({ min: 30 })
    .withMessage('Message must contain at least 30 characters'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, 400, errors.array({ onlyFirstError: true })[0]);
  }
  next();
};

module.exports = {
  donationPostValidation,
  validate,
};
