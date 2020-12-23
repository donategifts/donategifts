import { inject, injectable } from 'inversify';
import { ContactRepository } from './database/ContactRepository';

@injectable()
export class ContactService {
	constructor(@inject(ContactRepository) private contactRespository: ContactRepository) {}
}
