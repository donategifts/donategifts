const Contact = require('../models/Contact');

module.exports = class ContactRepository {
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
};
