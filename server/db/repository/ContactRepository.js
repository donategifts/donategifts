const Contact = require('../models/Contact');

async function createNewContact(contactParams) {
  try {
    const contact = new Contact(contactParams);
    await contact.save();
    return contact;
  } catch (error) {
    throw new Error(`Failed to create new Contact: ${error}`);
  }
}

module.exports = {
  createNewContact,
};
