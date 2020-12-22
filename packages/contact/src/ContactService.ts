import { injectable } from 'inversify';
import { ContactRepository } from './database/ContactRepository';

@injectable()
export class ContactService {
	constructor(private contactRespository: typeof ContactRepository = ContactRepository) {}
}
