const envVariables = [
	'PORT',
	'MONGO_URI',
	'NODE_ENV',
	'SESS_NAME',
	'SESS_SECRET',
	'SESS_LIFE',
	'MAILGUN_API_KEY',
	'MAILGUN_DOMAIN',
	'USE_AWS',
	'AWS_KEY',
	'AWS_SECRET',
	'S3BUCKET',
	'DEFAULT_EMAIL',
	'DEFAULT_EMAIL_PASSWORD',
	'BASE_URL',
	'GOOGLE_CAPTCHA_KEY',
	'G_CLIENT_ID',
	'FB_APP_ID',
	'SCRAPINGBEE_APIKEY',
	'STRIPE_API',
	'STRIPE_KEY',
	'STRIPE_SECRET',
	'WISHCARD_LOCK_IN_MINUTES',
	'PAYPAL_CLIENT_ID',
	'PAYPAL_SECRET',
	'PAYPAL_WEBHOOK_ID',
	'DISCORD_CLIENT_ID',
	'DISCORD_TOKEN',
	'DISCORD_STATUS_WEBHOOK_URL',
	'DISCORD_CONTACT_WEBHOOK_URL',
	'LOG_LEVEL',
	'MAINTENANCE_ENABLED',
];

const envVars = {};

// set them to null if they're empty
for (const variable of envVariables) {
	if (!process.env[variable] || process.env[variable] === '') {
		envVars[variable] = null;
	} else if (process.env[variable] === 'true') {
		envVars[variable] = true;
	} else if (process.env[variable] === 'false') {
		envVars[variable] = false;
	} else if (parseInt(process.env[variable], 10)) {
		envVars[variable] = parseInt(process.env[variable], 10);
	} else {
		envVars[variable] = process.env[variable];
	}
}

module.exports = {
	PORT: envVars.PORT,

	MONGO_URI: envVars.MONGO_URI,
	NODE_ENV: envVars.NODE_ENV,

	SESSION: {
		NAME: envVars.SESS_NAME,
		SECRET: envVars.SESS_SECRET,
		LIFE: envVars.SESS_LIFE,
	},

	MAILGUN: {
		API_KEY: envVars.MAILGUN_API_KEY,
		DOMAIN: envVars.MAILGUN_DOMAIN,
	},

	AWS: {
		USE: envVars.USE_AWS,
		KEY: envVars.AWS_KEY,
		SECRET: envVars.AWS_SECRET,
		S3BUCKET: envVars.S3BUCKET,
	},

	EMAIL: {
		ADDRESS: envVars.DEFAULT_EMAIL,
		PASSWORD: envVars.DEFAULT_EMAIL_PASSWORD,
	},

	BASE_URL: envVars.BASE_URL,

	GOOGLE_CAPTCHA_KEY: envVars.GOOGLE_CAPTCHA_KEY,

	G_CLIENT_ID: envVars.G_CLIENT_ID,
	FB_APP_ID: envVars.FB_APP_ID,

	SCRAPINGBEE_APIKEY: envVars.SCRAPINGBEE_APIKEY,

	STRIPE: {
		API: envVars.STRIPE_API,
		KEY: envVars.STRIPE_KEY,
		SECRET: envVars.STRIPE_SECRET,
	},

	WISHCARD_LOCK_IN_MINUTES: envVars.WISHCARD_LOCK_IN_MINUTES,

	PAYPAL: {
		CLIENT_ID: envVars.PAYPAL_CLIENT_ID,
		SECRET: envVars.PAYPAL_SECRET,
		WEBHOOK_ID: envVars.PAYPAL_WEBHOOK_ID,
	},

	DISCORD: {
		CLIENT_ID: envVars.DISCORD_CLIENT_ID,
		TOKEN: envVars.DISCORD_TOKEN,
		STATUS_WEBHOOK_URL: envVars.DISCORD_STATUS_WEBHOOK_URL,
		CONTACT_WEBHOOK_URL: envVars.DISCORD_CONTACT_WEBHOOK_URL,
	},

	LOG_LEVEL: envVars.LOG_LEVEL,

	MAINTENANCE_ENABLED: envVars.MAINTENANCE_ENABLED,
};
