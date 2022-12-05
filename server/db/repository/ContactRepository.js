const Contact = require('../models/Contact');

class ContactRepository {
	#contactModel;

	constructor() {
		this.#contactModel = Contact;
	}

	async createNewContact(contactParams) {
		try {
			return this.#contactModel.create(contactParams);
		} catch (error) {
			throw new Error(`Failed to create new Contact: ${error}`);
		}
	}
}

async function createNewContact(contactParams) {
	try {
		const contact = new Contact(contactParams);
		return contact.save();
	} catch (error) {
		throw new Error(`Failed to create new Contact: ${error}`);
	}
}

module.exports = {
	ContactRepository,
	createNewContact,
};
