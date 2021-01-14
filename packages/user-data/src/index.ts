import { Container } from 'inversify';
import { DBUser } from './DBUser';
import { UserRepository as userRepository } from './UserRepository';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind<typeof DBUser>(DBUser).toConstantValue(DBUser);

export const UserRepository: userRepository = container.get(userRepository);
