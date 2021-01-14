import { Container } from 'inversify';
import { UserService as userService } from './UserService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const UserService: userService = container.get(userService);
