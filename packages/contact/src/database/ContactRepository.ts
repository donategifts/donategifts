import { DBContact } from './DBContact';

export class ContactRepository {
	async createNewContact(contactParams) {
		try {
			const contact = new DBContact(contactParams);
			return contact.save();
		} catch (error) {
			throw new Error(`Failed to create new Contact: ${error}`);
		}
	}
}
