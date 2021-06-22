import { Container } from 'inversify';
import { AgencyService as agencyService } from './AgencyService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const AgencyService: agencyService = container.get(agencyService);
