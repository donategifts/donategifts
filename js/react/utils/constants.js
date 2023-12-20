const LOGIN = 'LOGIN';
const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL';
const SIGNUP = 'SIGNUP';

const GOOGLE_CLIENT_LIBRARY_URL = 'https://accounts.google.com/gsi/client';

const AMAZON_URL_REGEX = /^(https?(:\/\/)){1}([w]{3})(\.amazon\.com){1}\/.*$/;
const AMAZON_PRODUCT_REGEX = /\/dp\/([A-Z0-9]{10})/;

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

const PARTNER_CAROUSEL_DATA = [
	{
		url: 'https://www.childrensaidnyc.org/',
		img: '/svg/childrens-aid-logo.svg',
		alt: 'Childrens Aid NYC Agency logo',
	},
	{
		url: 'https://childrenawaitingparents.org/',
		img: '/img/cap-logo.png',
		alt: 'CAP Agency logo',
	},
	{
		url: 'https://www.ococtexas.org/',
		img: '/img/ocog-logo.webp',
		alt: 'OCOC Texas logo',
	},
	{
		url: 'https://centraltexastableofgrace.org/',
		img: '/img/central-texas-table-of-grace-logo.jpg',
		alt: 'Central Texas Table of Grace logo',
	},
	{
		url: 'https://onehopeunited.org/',
		img: '/img/onehopeunited.png',
		alt: 'One Hope United logo',
	},
	{
		url: 'https://www.newalternativesnyc.org/',
		img: '/img/new-alternatives-logo.png',
		alt: 'New Alternatives logo',
	},
	{
		url: 'http://www.lacasanorte.org/',
		img: '/img/la-casa-norte-logo.png',
		alt: 'La casa norte logo',
	},
	{
		url: 'https://www.yos.org/',
		img: '/img/yos-logo-2.jpeg',
		alt: 'Youth Outreach Services logo',
	},
	{
		url: 'https://www.eaglequestservices.org/',
		img: '/img/eaglequest-logo.png',
		alt: 'Eagle Quest logo',
	},
	{
		url: 'https://www.azleway.org/',
		img: '/img/azleway-logo.png',
		alt: 'Azleway logo',
	},
	{
		url: 'https://www.fosteringhopefoundation.org',
		img: '/img/fostering-hope-logo.jpg',
		alt: 'Fostering Hope logo',
	},
	{
		url: 'https://www.yougottabelieve.org/',
		img: '/img/you-gotta-believe-logo.jpg',
		alt: 'You gotta believe logo',
	},
	{
		url: 'https://www.pennylane.org/',
		img: '/img/penny-lane-logo.png',
		alt: 'Penny Lane Agency logo',
	},
	{
		url: 'https://www.epworthfamilyresources.org/',
		img: '/img/epworth-tran-logo.png',
		alt: 'Epworth Village logo',
	},
	{
		url: 'https://www.echoesofhope.org/',
		img: '/img/echoes-of-hope-logo.png',
		alt: 'Echoes of Hope logo',
	},
	{
		url: 'https://www.blueskiesforchildren.org/',
		img: '/img/blue-sky-agency-logo.png',
		alt: 'Blue Skies for Children logo',
	},
	{
		url: 'https://casala.org/',
		img: '/img/casa-la-logo.png',
		alt: 'CASA of Los Angeles logo',
	},
	{
		url: 'https://www.hartdistrict.org/',
		img: '/img/hart-district-logo.png',
		alt: 'William Hart district logo',
	},
	{
		url: 'https://www.nyap.org/',
		img: '/img/nyap-logo.png',
		alt: 'National Youth Advocate Program logo',
	},
];

export {
	LOGIN,
	LOGIN_WITH_EMAIL,
	SIGNUP,
	GOOGLE_CLIENT_LIBRARY_URL,
	AMAZON_URL_REGEX,
	AMAZON_PRODUCT_REGEX,
	STATE_NAMES,
	BIRTH_YEAR,
	PARTNER_CAROUSEL_DATA,
};
