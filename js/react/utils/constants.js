const LOGIN = 'LOGIN';
const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL';
const SIGNUP = 'SIGNUP';

const GOOGLE_CLIENT_LIBRARY_URL = 'https://accounts.google.com/gsi/client';

const FORM_INPUT_MAP = {
	childFirstName: {
		label: `Child's first name`,
		defaultError: `Please enter child's first name.`,
		sizeError: `Must be more than 1 character and less than 250 characters.`,
		validateError: `Input is only allowed to have alphabets, space, underscore, and hyphen.`,
	},
	childInterest: {
		label: `Child's interest`,
		defaultError: `Please enter child's interest.`,
		sizeError: `Must be more than 1 character and less than 250 characters.`,
		placeholder: `(e.g. write something they like to do)`,
	},
	childBirthYear: {
		label: `Child's birth year`,
		defaultError: `Please select child's birth year.`,
		placeholder: `Select birth year`,
	},
	childImage: {
		label: `Upload child's picture`,
		defaultError: `Please upload child's image.`,
		instruction: `You must use an image that is representative of the
		child (Also allowed: masked faces, cropped or
		blurred features, art or something they made)`,
		popOverText: `Child's image is required because 
		users are more encouraged to donate to the wish cards with children's photos. 
		Please see FAQ for more help.`,
	},
	childStory: {
		label: `Share the child's story`,
		defaultError: `Please enter child's story.`,
		sizeError: `Must be more than 5 characters and less than 600 characters.`,
		placeholder: `(e.g. what is their story? why do they want this item?)`,
	},
	wishItemName: {
		label: `Wish item name`,
		defaultError: `Please enter wish item name.`,
		sizeError: `Must be more than 1 character and less than 150 characters.`,
	},
	wishItemPrice: {
		label: `Wish item price`,
		defaultError: `Please enter wish item price.`,
		placeholder: `price must be rounded up and under $40`,
		popOverText: `Item must be under $40. 
		Accepted wish items include toys, games, school supplies, hobby supplies, and wearable items such as gloves, shoes, etc. 
		However, they may NOT ask for gift cards.`,
	},
	wishItemInfo: {
		label: `Wish item description`,
		defaultError: `Please enter wish item description.`,
		placeholder: `share product details`,
		popOverText: `Please provide specific details of the item, such as type, vendor, size, color, etc.`,
	},
	wishItemURL: {
		label: `Wish item Amazon URL`,
		defaultError: `Please enter wish item URL.`,
		placeholder: `product page link starting with https://www.amazon...`,
		popOverText: `Search for product link, then copy and paste the exact Amazon product link URL from the domain bar.`,
	},
	wishItemImage: {
		label: `Upload item picture`,
		defaultError: `Please upload item image.`,
		instruction: `You must use an image that is representative of the
		wish item product.`,
		popOverText: `Wish item image is required. Please upload a product photo.`,
	},
};

const STATE_NAMES = [
	'Alabama',
	'Alaska',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'Florida',
	'Georgia',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Pennsylvania',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Utah',
	'Vermont',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
];

const BIRTH_YEAR = [
	'2023',
	'2022',
	'2021',
	'2020',
	'2019',
	'2018',
	'2017',
	'2016',
	'2015',
	'2014',
	'2013',
	'2012',
	'2011',
	'2010',
	'2009',
	'2008',
	'2007',
	'2006',
	'2005',
	'2004',
	'2003',
	'2002',
];

export {
	LOGIN,
	LOGIN_WITH_EMAIL,
	SIGNUP,
	GOOGLE_CLIENT_LIBRARY_URL,
	FORM_INPUT_MAP,
	STATE_NAMES,
	BIRTH_YEAR,
};
