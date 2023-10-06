export default class SessionError extends Error {
	constructor(message: string) {
		super();

		this.name = 'SessionError';
		this.message = message;
	}
}
