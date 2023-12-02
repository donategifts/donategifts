import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({
	path: path.join(__dirname, '../../config.env'),
});

const envVariables = [
	'PORT',
	'PG_HOST',
	'PG_PORT',
	'PG_USER',
	'PG_PASSWORD',
	'PG_DATABASE',
	'ENABLE_QUERY_LOGGING',
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
	'STRIPE_PUBLISHABLE_KEY',
	'STRIPE_SECRET_KEY',
	'STRIPE_SIGNING_SECRET',
	'STRIPE_SIGNING_SECRET_LOCAL',
	'PAYPAL_CLIENT_ID',
	'PAYPAL_SECRET',
	'PAYPAL_WEBHOOK_ID',
	'DISCORD_CLIENT_ID',
	'DISCORD_TOKEN',
	'DISCORD_STATUS_WEBHOOK_URL',
	'DISCORD_CONTACT_WEBHOOK_URL',
	'DISCORD_AGENCY_REGISTRATION_WEBHOOK_URL',
	'LOG_LEVEL',
	'MAINTENANCE_ENABLED',
];

type EnvVars = {
	PORT: number;
	PG_HOST: string;
	PG_PORT: number;
	PG_USER: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	ENABLE_QUERY_LOGGING: boolean;
	MONGO_URI: string;
	NODE_ENV: string;
	SESS_NAME: string;
	SESS_SECRET: string;
	SESS_LIFE: number;
	MAILGUN_API_KEY: string | null;
	MAILGUN_DOMAIN: string | null;
	USE_AWS: boolean;
	AWS_KEY: string | null;
	AWS_SECRET: string | null;
	S3BUCKET: string | null;
	DEFAULT_EMAIL: string | null;
	DEFAULT_EMAIL_PASSWORD: string | null;
	BASE_URL: string;
	GOOGLE_CAPTCHA_KEY: string | null;
	G_CLIENT_ID: string | null;
	FB_APP_ID: string | null;
	STRIPE_PUBLISHABLE_KEY: string;
	STRIPE_SECRET_KEY: string;
	STRIPE_SIGNING_SECRET: string;
	STRIPE_SIGNING_SECRET_LOCAL: string;
	PAYPAL_CLIENT_ID: string;
	PAYPAL_SECRET: string;
	PAYPAL_WEBHOOK_ID: string;
	DISCORD_CLIENT_ID: string | null;
	DISCORD_TOKEN: string | null;
	DISCORD_STATUS_WEBHOOK_URL: string | null;
	DISCORD_CONTACT_WEBHOOK_URL: string | null;
	DISCORD_AGENCY_REGISTRATION_WEBHOOK_URL: string | null;
	LOG_LEVEL: string;
	MAINTENANCE_ENABLED: boolean;
};

const envVars = {} as EnvVars;

// set them to null if they're empty
for (const variable of envVariables) {
	const currentEnvVar = process.env[variable];
	if (!currentEnvVar || currentEnvVar === '') {
		// @ts-ignore
		envVars[variable] = null;
	} else if (currentEnvVar === 'true') {
		// @ts-ignore
		envVars[variable] = true;
	} else if (currentEnvVar === 'false') {
		// @ts-ignore
		envVars[variable] = false;
	} else if (!isNaN(currentEnvVar as any)) {
		// @ts-ignore
		envVars[variable] = parseInt(currentEnvVar as string, 10);
	} else {
		// @ts-ignore
		envVars[variable] = currentEnvVar;
	}
}

export default {
	PORT: envVars.PORT,

	PG_HOST: envVars.PG_HOST,
	PG_PORT: envVars.PG_PORT,
	PG_USER: envVars.PG_USER,
	PG_PASSWORD: envVars.PG_PASSWORD,
	PG_DATABASE: envVars.PG_DATABASE,

	ENABLE_QUERY_LOGGING: envVars.ENABLE_QUERY_LOGGING,

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

	STRIPE: {
		PUBLISHABLE_KEY: envVars.STRIPE_PUBLISHABLE_KEY,
		SECRET_KEY: envVars.STRIPE_SECRET_KEY,
		SIGNING_SECRET: envVars.STRIPE_SIGNING_SECRET,
		SIGNING_SECRET_LOCAL: envVars.STRIPE_SIGNING_SECRET_LOCAL,
	},

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
		AGENCY_REGISTRATION_WEBHOOK_URL: envVars.DISCORD_AGENCY_REGISTRATION_WEBHOOK_URL,
	},

	LOG_LEVEL: envVars.LOG_LEVEL,

	MAINTENANCE_ENABLED: envVars.MAINTENANCE_ENABLED,
};
