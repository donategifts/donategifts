import { Container } from 'inversify';
import { MessageRepository as messageRepository } from './database/MessageRepository';
import { MessagingService as messagingService } from './MessagingService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const MessageRepository: messageRepository = container.get(messageRepository);
export const MessagingService: messagingService = container.get(messagingService);
