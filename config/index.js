module.exports = {
	PORT: process.env.PORT ? Number(process.env.PORT) : 3000,

	MONGO_URI: process.env.MONGO_URI
		? String(process.env.MONGO_URI)
		: 'mongodb://localhost/donategifts?w=majority',
	NODE_ENV: process.env.NODE_ENV ? String(process.env.NODE_ENV) : 'development',

	SESSION: {
		NAME: process.env.SESS_NAME ? String(process.env.SESS_NAME) : 'sid',
		SECRET: process.env.SESS_SECRET
			? String(process.env.SESS_SECRET)
			: 'something-super-duper-secret',
		LIFE: process.env.SESS_LIFE ? Number(process.env.SESS_LIFE) : 3600000,
	},

	MAILGUN: {
		API_KEY: process.env.MAILGUN_API_KEY ? String(process.env.MAILGUN_API_KEY) : undefined,
		DOMAIN: process.env.MAILGUN_DOMAIN ? String(process.env.MAILGUN_DOMAIN) : undefined,
	},

	AWS: {
		USE: process.env.USE_AWS || false,
		KEY: process.env.AWS_KEY ? String(process.env.AWS_KEY) : undefined,
		SECRET: process.env.AWS_SECRET ? String(process.env.AWS_SECRET) : undefined,
		S3BUCKET: process.env.S3BUCKET ? String(process.env.S3BUCKET) : undefined,
	},

	EMAIL: {
		ADDRESS: process.env.DEFAULT_EMAIL ? String(process.env.DEFAULT_EMAIL) : undefined,
		PASSWORD: process.env.DEFAULT_EMAIL_PASSWORD
			? String(process.env.DEFAULT_EMAIL_PASSWORD)
			: undefined,
	},

	BASE_URL: process.env.BASE_URL
		? String(process.env.BASE_URL)
		: undefined || 'http://localhost:3000',

	GOOGLE_CAPTCHA_KEY: process.env.GOOGLE_CAPTCHA_KEY
		? String(process.env.GOOGLE_CAPTCHA_KEY)
		: undefined,

	G_CLIENT_ID: process.env.G_CLIENT_ID ? String(process.env.G_CLIENT_ID) : undefined,
	FB_APP_ID: process.env.FB_APP_ID ? String(process.env.FB_APP_ID) : undefined,

	SCRAPINGBEE_APIKEY: process.env.SCRAPINGBEE_APIKEY
		? String(process.env.SCRAPINGBEE_APIKEY)
		: undefined,

	STRIPE: {
		API: process.env.STRIPE_API ? String(process.env.STRIPE_API) : undefined,
		KEY: process.env.STRIPE_KEY ? String(process.env.STRIPE_KEY) : undefined,
		SECRET: process.env.STRIPE_SECRET ? String(process.env.STRIPE_SECRET) : undefined,
	},

	WISHCARD_LOCK_IN_MINUTES: 10,

	PAYPAL: {
		CLIENT_ID: process.env.PAYPAL_CLIENT_ID ? String(process.env.PAYPAL_CLIENT_ID) : undefined,
		SECRET: process.env.PAYPAL_SECRET ? String(process.env.PAYPAL_SECRET) : undefined,
		WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID
			? String(process.env.PAYPAL_WEBHOOK_ID)
			: undefined,
	},

	DISCORD: {
		CLIENT_ID: process.env.DISCORD_CLIENT_ID
			? String(process.env.DISCORD_CLIENT_ID)
			: undefined,
		TOKEN: process.env.DISCORD_TOKEN ? String(process.env.DISCORD_TOKEN) : undefined,
		STATUS_WEBHOOK_URL: process.env.DISCORD_STATUS_WEBHOOK_URL
			? String(process.env.DISCORD_STATUS_WEBHOOK_URL)
			: undefined,
		CONTACT_WEBHOOK_URL: process.env.DISCORD_CONTACT_WEBHOOK_URL
			? String(process.env.DISCORD_CONTACT_WEBHOOK_URL)
			: undefined,
	},

	LOG_LEVEL: process.env.LOG_LEVEL ? String(process.env.LOG_LEVEL) : 'debug',

	MAINTENANCE_ENABLED: process.env.MAINTENANCE_ENABLED || false,
};
