import { Container } from 'inversify';
import { UserRepository as userRepository } from './database/UserRepository';
import { UserService as userService } from './UserService';
import { DBUser } from './database/DBUser';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBUser).toConstantValue(DBUser);

export const UserRepository: userRepository = container.get(userRepository);
export const UserService: userService = container.get(userService);
