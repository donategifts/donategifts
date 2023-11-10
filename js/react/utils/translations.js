import { STATE_NAMES } from './constants';

//TODO: @stacysealky outdated - need to check and remove
const ADDRESS_FORM_INPUTS = {
	address1: {
		label: 'Address Line 1',
		errors: {
			default: 'Address line 1 is required.',
			size: 'Address must be 2 to 250 characters long.',
		},
	},
	address2: {
		label: 'Address Line 2',
	},
	city: {
		label: 'City',
		errors: {
			default: 'City is required.',
			size: 'City must be 2 to 250 characters long.',
		},
	},
	state: {
		label: 'State',
		errors: {
			default: 'State is required.',
		},
		placeholder: 'Select option',
	},
	country: {
		label: 'Country',
		errors: {
			default: 'Country is required.',
		},
		placeholder: 'Select option',
	},
	zipcode: {
		label: 'Zipcode',
		errors: {
			default: 'Zipcode is required.',
			size: 'Zipcode must contain at least 5 characters.',
		},
	},
};

const AGENCY_SIGNUP_FORM_INPUTS = {
	agencyName: {
		label: 'Agency Name',
		errors: {
			default: 'Agency name is required.',
			size: 'Must be 2 to 250 characters long.',
		},
	},
	agencyWebsite: {
		label: 'Agency Website',
	},
	agencyPhone: {
		label: 'Agency Phone Number',
		errors: {
			default: 'Agency phone number is required.',
			validate: 'Phone number must be 10 digits and follow the format of (333) 444-5555',
		},
	},
	agencyEIN: {
		label: 'EIN (Employer Identification Number)',
		errors: {
			default: 'EIN (Employer Identification Number) is required.',
			validate: 'EIN must be 9 digits and follow the format of (12-3456789)',
		},
		placeholder: '(12-3456789)',
	},
	agencyBio: {
		label: 'Agency Description',
		errors: {
			default: 'Agency description is required.',
			size: 'Must be 5 to 500 characters long.',
		},
		placeholder: `(e.g. Your non-profit agency's purpose, mission, history, etc.)`,
	},
	agencyImage: {
		label: 'Upload your agency logo',
		errors: {
			size: 'File must be less than 5 megabytes.',
			validate: 'File must be in jpeg, jpg, gif, or png format.',
		},
		instruction: 'Please upload an agency logo or an image that represents your agency.',
	},
	address1: {
		label: 'Address Line 1',
		errors: {
			default: 'Address line 1 is required.',
			size: 'Address line 1 must contain at least 2 characters.',
		},
	},
	address2: {
		label: 'Address Line 2',
	},
	city: {
		label: 'City',
		errors: {
			default: 'City is required.',
			size: 'City must contain at least 2 characters.',
		},
	},
	state: {
		label: 'State',
		errors: {
			default: 'State is required.',
		},
		placeholder: 'Select option',
		data: STATE_NAMES,
	},
	country: {
		label: 'Country',
		errors: {
			default: 'Country is required.',
		},
		placeholder: 'Select option',
		data: ['United States'],
	},
	zipcode: {
		label: 'Zipcode',
		errors: {
			default: 'Zipcode is required.',
		},
	},
};

const WISHCARD_FORM_INPUTS = {
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

export { WISHCARD_FORM_INPUTS, AGENCY_SIGNUP_FORM_INPUTS, ADDRESS_FORM_INPUTS };
