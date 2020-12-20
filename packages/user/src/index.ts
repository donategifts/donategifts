import { Container } from 'inversify';
import { UserRepository as userRepository } from './database/UserRepository';
import { UserService as userService } from './UserService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const UserRepository: userRepository = container.get(userRepository);
export const UserService: userService = container.get(userService);
