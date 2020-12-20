import { injectable } from 'inversify';
import { MessageRepository } from './database/MessageRepository';

@injectable()
export class MessagingService {
	constructor(private messageRepository: typeof MessageRepository = MessageRepository) {}
}
