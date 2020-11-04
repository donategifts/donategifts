import Contact from '../models/Contact';

async function createNewContact(contactParams) {
  try {
    const contact = new Contact(contactParams);
    return contact.save();
  } catch (error) {
    throw new Error(`Failed to create new Contact: ${error}`);
  }
}

export { createNewContact };
