import { Container } from 'inversify';
import { ContactRepository as contactRepository } from './database/ContactRepository';
import { ContactService as contactService } from './ContactService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const ContactRepository: contactRepository = container.get(contactRepository);
export const ContactService: contactService = container.get(contactService);
