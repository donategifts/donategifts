const { body, validationResult, param } = require('express-validator');
const { handleError } = require('../../helper/error');

const signupValidationRules = () => {
  return [
    body('fName', 'First name is required!').notEmpty().isString(),
    body('lName', 'Last name is required!').notEmpty().isString(),
    body('email', 'Email is required!')
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage('Please provide a proper email address')
      .trim(),
    body('password')
      .notEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage('must be at least 8 characters long')
      .matches(/^(?=.*\d.*)(?=.*[a-z].*)(?=.*[A-Z].*).{8,}$/)
      .withMessage('Password must contain a number, one lower and one uppercase letter'),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('userRole', 'A role is required!').notEmpty().isString(),
  ];
};

const googlesignupValidationRules = () => {
  return [body('id_token').exists()];
};

const fbsignupValidationRules = () => {
  return [body('userName').exists(), body('email').exists().isEmail()];
};

const updateProfileValidationRules = () => {
  return [body('aboutMe', 'About me text is required!').exists()];
};

const createAgencyValidationRules = () => {
  return [
    body('agencyName')
      .notEmpty()
      .isString()
      .withMessage('Agency name is required!'),
    body('agencyWebsite').optional(),
    body('agencyAddress.address1')
      .notEmpty()
      .isLength({min: 5, max: undefined})
      .withMessage('Address must contain at least 5 characters'),
    body('agencyAddress.address2').optional(),
    body('agencyAddress.city')
      .notEmpty()
      .isLength({min: 2, max: undefined})
      .withMessage('City must contain at least 2 characters'),
    body('agencyAddress.state')
      .notEmpty()
      .isLength({min: 2, max: undefined})
      .withMessage('State must contain at least 2 characters'),
    body('agencyAddress.country')
      .notEmpty()
      .isLength({min: 2, max: undefined})
      .withMessage('Country must contain at least 2 characters'),
    body('agencyAddress.zipcode')
      .notEmpty()
      .isLength({min: 5, max: undefined})
      .withMessage('Zipcode must contain at least 5 characters'),
    body('agencyPhone')
      .notEmpty()
      .isLength({ min: 7, max: undefined })
      .withMessage('Phone number must be at least 7 characters long')
      .matches(/^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/) 
      .withMessage('Phone number must match format XXX-XXX-XXXX'),
    body('agencyBio').optional(),
    
  ];
};

const loginValidationRules = () => {
  return [
    body('email', 'Email is required!')
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage('Please provide an email address')
      .trim(),
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
    body('passwordConfirm')
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*\d.*)(?=.*[a-z].*)(?=.*[A-Z].*).{8,}$/)
      .withMessage('Password must contain a number, one lower and one uppercase letter')
      .isString(),
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
