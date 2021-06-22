export class SignupError extends Error {
	constructor(err: string) {
		super(err);

		// Set the prototype explicitly. https://github.com/Microsoft/TypeScript/issues/13965
		Object.setPrototypeOf(this, SignupError.prototype);
	}
}
