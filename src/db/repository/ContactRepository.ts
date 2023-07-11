import Contact from '../models/Contact';

export default class ContactRepository {
	private contactModel: typeof Contact;

	constructor() {
		this.contactModel = Contact;
	}

	async createNewContact(contactParams: Partial<Contact>) {
		try {
			return this.contactModel.create(contactParams);
		} catch (error) {
			throw new Error(`Failed to create new Contact: ${error}`);
		}
	}
}
