import { Container } from 'inversify';
import { MessageRepository as messageRepository } from './database/MessageRepository';
import { MessagingService as messagingService } from './MessagingService';
import { DBMessage } from './database/DBMessage';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBMessage).toConstantValue(DBMessage);

export const MessageRepository: messageRepository = container.get(messageRepository);
export const MessagingService: messagingService = container.get(messagingService);
