const { body, validationResult, param } = require('express-validator');

const UserRepository = require('../db/repository/UserRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

const { handleError } = require('./error');
const { getMessageChoices } = require('./defaultMessages');

const signupValidationRules = () => [
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

const googlesignupValidationRules = () => [body('id_token').exists()];

const fbsignupValidationRules = () => [body('userName').exists(), body('email').exists().isEmail()];

const updateProfileValidationRules = () => [body('aboutMe', 'About me text is required!').exists()];

const createAgencyValidationRules = () => [
	body('agencyName').notEmpty().isString().withMessage('Agency name is required!'),
	body('agencyWebsite').optional(),
	body('agencyAddress.address1')
		.notEmpty()
		.isLength({ min: 5 })
		.withMessage('Address must contain at least 5 characters'),
	body('agencyAddress.address2').optional(),
	body('agencyAddress.city')
		.notEmpty()
		.isLength({ min: 2 })
		.withMessage('City must contain at least 2 characters'),
	body('agencyAddress.state')
		.notEmpty()
		.isLength({ min: 2 })
		.withMessage('State must contain at least 2 characters'),
	body('agencyAddress.country')
		.notEmpty()
		.isLength({ min: 2 })
		.withMessage('Country must contain at least 2 characters'),
	body('agencyAddress.zipcode')
		.notEmpty()
		.isLength({ min: 5 })
		.withMessage('Zipcode must contain at least 5 characters'),
	body('agencyPhone')
		.notEmpty()
		.isLength({ min: 7 })
		.withMessage('Phone number must be at least 7 characters long')
		.matches(/^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
		.withMessage('Phone number must match format XXX-XXX-XXXX'),
	body('agencyBio').optional(),
];

const loginValidationRules = () => [
	body('email', 'Email is required!')
		.notEmpty()
		.isString()
		.isEmail()
		.withMessage('Please provide an email address')
		.trim(),
	body('password').notEmpty().isString(),
];

const verifyHashValidationRules = () => [param('hash').exists()];

const passwordRequestValidationRules = () => [body('email').notEmpty().isEmail()];

const getPasswordResetValidationRules = () => [param('token').exists()];

const postPasswordResetValidationRules = () => [
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

const createWishcardValidationRules = () => [
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
		.matches(/^(https?(:\/\/)){1}([w]{3})(\.amazon\.com){1}\/.*$/)
		.withMessage('Wish item url has to be a valid amazon link!'),
	body('childStory').notEmpty().withMessage("Child's story is required").isString(),
	body('address1')
		.notEmpty()
		.withMessage('Address cannot be empty')
		.isLength({ min: 5 })
		.withMessage('Address must contain at least 5 characters'),
	body('address2').optional(),
	body('address_city')
		.notEmpty()
		.withMessage('City cannot be empty')
		.isLength({ min: 2 })
		.withMessage('City must contain at least 2 characters'),
	body('address_state')
		.notEmpty()
		.withMessage('State cannot be empty')
		.isLength({ min: 2 })
		.withMessage('State must contain at least 2 characters'),
	body('address_country')
		.notEmpty()
		.withMessage('Country cannot be empty')
		.isLength({ min: 2 })
		.withMessage('Country must contain at least 2 characters'),
	body('address_zip')
		.notEmpty()
		.withMessage('Zip cannot be empty')
		.isLength({ min: 5 })
		.withMessage('Zipcode must contain at least 5 characters'),
];

const createGuidedWishcardValidationRules = () => [
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
		.isLength({ min: 5 })
		.withMessage('Address must contain at least 5 characters'),
	body('address2').optional(),
	body('address_city')
		.notEmpty()
		.withMessage('City cannot be empty')
		.isLength({ min: 2 })
		.withMessage('City must contain at least 2 characters'),
	body('address_state')
		.notEmpty()
		.withMessage('State cannot be empty')
		.isLength({ min: 2 })
		.withMessage('State must contain at least 2 characters'),
	body('address_country')
		.notEmpty()
		.withMessage('Country cannot be empty')
		.isLength({ min: 2 })
		.withMessage('Country must contain at least 2 characters'),
	body('address_zip')
		.notEmpty()
		.withMessage('Zip cannot be empty')
		.isLength({ min: 5 })
		.withMessage('Zipcode must contain at least 5 characters'),
];

const searchValidationRules = () => [
	body('wishitem').notEmpty().withMessage('Wishitem is required'),
];

const getByIdValidationRules = () => [
	param('id').notEmpty().withMessage('Id parameter is required'),
];

const updateWishCardValidationRules = () => [
	param('id').notEmpty().withMessage('Id parameter is required'),
];

const postMessageValidationRules = () => [
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

const getDefaultCardsValidationRules = () => [
	param('id').notEmpty().withMessage('Id parameter is required'),
];

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
	createWishcardValidationRules,
	createGuidedWishcardValidationRules,
	searchValidationRules,
	getByIdValidationRules,
	updateWishCardValidationRules,
	postMessageValidationRules,
	getDefaultCardsValidationRules,
	donationPostValidation,
	validate,
};
