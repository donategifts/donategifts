import { inject, injectable } from 'inversify';
import { MessageRepository } from './database/MessageRepository';

@injectable()
export class MessagingService {
	constructor(@inject(MessageRepository) private messageRepository: MessageRepository) {}
}
