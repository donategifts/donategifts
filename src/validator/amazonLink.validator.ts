import { ExpressValidator } from 'express-validator';

export const amazonValidator = new ExpressValidator({
	/**
	 * Check is url is valid amazon link
	 * @param value
	 * @returns {boolean}
	 */
	isValidLink: (value: string) => {
		const amazonUrlRegex = /^(https?(:\/\/)){1}([w]{3})(\.amazon\.com){1}\/.*$/;
		const amazonProductRegex = /\/dp\/([A-Z0-9]{10})/;
		return (
			typeof value === 'string' &&
			amazonUrlRegex.test(value) &&
			amazonProductRegex.test(value)
		);
	},
});
