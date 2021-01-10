import { Container } from 'inversify';
import { AuthenticationService as authenticationService } from './AuthenticationService';

export { hashPassword } from './helper/authenticationHelper';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const AuthenticationService: authenticationService = container.get(authenticationService);
