const LOGIN = 'LOGIN';
const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL';
const SIGNUP = 'SIGNUP';

const GOOGLE_CLIENT_LIBRARY_URL = 'https://accounts.google.com/gsi/client';

const AMAZON_URL_REGEX = /^(https?(:\/\/)){1}([w]{3})(\.amazon\.com){1}\/.*$/;
const AMAZON_PRODUCT_REGEX = /\/dp\/([A-Z0-9]{10})/;

const FORM_INPUT_MAP = {
	childFirstName: {
		label: "Child's first name",
		errors: {
			default: "Child's first name is required.",
			size: 'Must be 2 to 250 characters long.',
			validate: 'Only alphabets, spaces, underscores, and hyphens are allowed.',
		},
	},
	childInterest: {
		label: "Child's interest",
		errors: {
			default: "Child's interest is required.",
			size: 'Must be 2 to 250 characters long.',
		},
		placeholder: '(e.g. hobbies, interests, etc.)',
	},
	childBirthYear: {
		label: "Child's birth year",
		errors: {
			default: "Please select child's birth year.",
		},
		placeholder: 'Select birth year',
	},
	childImage: {
		label: "Upload child's picture",
		errors: {
			default: "Child's image is required.",
			size: 'File must be less than 5 megabytes.',
			validate: 'File must be in jpeg, jpg, gif, or png format.',
		},
		instruction:
			"You must use an image that represents the child (masked faces, blurred features, or child's artwork are allowed).",
		popOverText:
			"Including a child's image encourages more donations. Please refer to the FAQ for assistance.",
	},
	childStory: {
		label: "Share the child's story",
		errors: {
			default: "Child's story is required.",
			size: 'Must be 5 to 500 characters long.',
		},
		placeholder: "(e.g. child's background and why they want this item)",
	},
	wishItemName: {
		label: 'Wish item name',
		errors: {
			default: 'Wish item name is required.',
			size: 'Must be 2 to 150 characters long.',
		},
	},
	wishItemPrice: {
		label: 'Wish item price',
		errors: {
			default: 'Wish item price is required.',
			size: 'Must be over 1 and under 40.',
			validate: 'Price must be a number.',
		},
		placeholder: 'Price must be rounded up and under $40',
		popOverText:
			'Wish items must be under $40 and can include toys, games, school supplies, hobby supplies, and wearable items. Gift cards are not allowed.',
	},
	wishItemInfo: {
		label: 'Wish item description',
		errors: {
			default: 'Wish item description is required.',
			size: 'Must be 2 to 250 characters long.',
		},
		placeholder: 'Provide specific details of the item (type, vendor, size, color, etc.)',
	},
	wishItemURL: {
		label: 'Wish item Amazon URL',
		errors: {
			default: 'Wish item URL is required.',
			validate:
				'Item URL must start with https://www.amazon.com/ and contain a product ID to be valid.',
		},
		placeholder: 'Paste the Amazon product link (e.g., https://www.amazon...)',
		popOverText: 'Copy and paste the exact Amazon product link URL from the address bar.',
	},
	wishItemImage: {
		label: 'Upload item picture',
		errors: {
			default: 'Item image is required.',
			size: 'File must be less than 5 megabytes.',
			validate: 'File must be in jpeg, jpg, gif, or png format.',
		},
		instruction: 'Please upload a product photo that represents the wish item.',
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
	'2001',
	'2000',
];

export {
	LOGIN,
	LOGIN_WITH_EMAIL,
	SIGNUP,
	GOOGLE_CLIENT_LIBRARY_URL,
	AMAZON_URL_REGEX,
	AMAZON_PRODUCT_REGEX,
	FORM_INPUT_MAP,
	STATE_NAMES,
	BIRTH_YEAR,
};
