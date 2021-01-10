export class UserError extends Error {
	public reason?: string;

	constructor(err: string, reason?: string) {
		super(err);

		this.reason = reason;
		// Set the prototype explicitly. https://github.com/Microsoft/TypeScript/issues/13965
		Object.setPrototypeOf(this, UserError.prototype);
	}
}
