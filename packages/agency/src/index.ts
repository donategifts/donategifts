import { Container } from 'inversify';
import { AgencyService as agencyService } from './AgencyService';
import { AgencyRepository as agencyRespository } from './database/AgencyRepository';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const AgencyRepository: agencyRespository = container.get(agencyRespository);
export const AgencyService: agencyService = container.get(agencyService);
