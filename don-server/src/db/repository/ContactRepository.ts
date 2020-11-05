import { DBContact } from '../models/Contact';

async function createNewContact(contactParams) {
  try {
    const contact = new DBContact(contactParams);
    return contact.save();
  } catch (error) {
    throw new Error(`Failed to create new Contact: ${error}`);
  }
}

export { createNewContact };
