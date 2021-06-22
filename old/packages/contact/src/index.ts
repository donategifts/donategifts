import { Container } from 'inversify';
import { ContactRepository as contactRepository } from './database/ContactRepository';
import { ContactService as contactService } from './ContactService';
import { DBContact } from './database/DBContact';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBContact).toConstantValue(DBContact);

export const ContactRepository: contactRepository = container.get(contactRepository);
export const ContactService: contactService = container.get(contactService);
