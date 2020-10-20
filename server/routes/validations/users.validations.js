const { body, validationResult, param } = require('express-validator');
const { handleError } = require('../../helper/error');
const { log } = require('../../helper/logger');

const signupValidationRules = () => {
  return [
    body('fName').notEmpty().isString(),
    body('lName').notEmpty().isString(),
    body('email').isString().isEmail().trim(),
    body('password').notEmpty().isString().isLength({ min: 8 }),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('userRole').notEmpty().isString(),
  ];
};

const googlesignupValidationRules = () => {
  return [body('id_token').exists()];
};

const fbsignupValidationRules = () => {
  return [body('userName').exists(), body('email').exists().isEmail()];
};

const updateProfileValidationRules = () => {
  return [body('aboutMe').exists()];
};

const createAgencyValidationRules = () => {
  return [
    body('agencyName').notEmpty().isString(),
    body('agencyWebsite').optional(),
    body('agencyPhone').isNumeric().isLength({ min: 7, max: undefined }).notEmpty(),
    body('agencyBio').optional(),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').notEmpty().isString().isEmail().trim(),
    body('password').notEmpty().isString(),
  ];
};

const verifyHashValidationRules = () => {
  return [param('hash').exists()];
};

const passwordRequestValidationRules = () => {
  return [body('email').notEmpty().isEmail()];
};

const getPasswordResetValidationRules = () => {
  return [param('token').exists()];
};

const postPasswordResetValidationRules = () => {
  return [
    body('password').notEmpty().isString().trim(),
    body('passwordConfirm').notEmpty().isString(),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log(req, errors);
    return handleError(res, 400, errors.array({ onlyFirstError: true })[0]);
  }
  next();
};

module.exports = {
  signupValidationRules,
  googlesignupValidationRules,
  fbsignupValidationRules,
  verifyHashValidationRules,
  passwordRequestValidationRules,
  updateProfileValidationRules,
  createAgencyValidationRules,
  loginValidationRules,
  getPasswordResetValidationRules,
  postPasswordResetValidationRules,
  validate,
};
