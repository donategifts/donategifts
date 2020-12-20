import { inject, injectable } from 'inversify';
import { DBContact } from './DBContact';

// TODO: needs typing
@injectable()
export class ContactRepository {
	constructor(@inject(DBContact) private dbContact: typeof DBContact) {}

	async createNewContact(contactParams) {
		try {
			return this.dbContact.create(contactParams);
		} catch (error) {
			throw new Error(`Failed to create new Contact: ${error}`);
		}
	}
}
