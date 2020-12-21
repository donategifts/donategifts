import { Container } from 'inversify';
import { AgencyService as agencyService } from './AgencyService';
import { AgencyRepository as agencyRespository } from './database/AgencyRepository';
import { DBAgency } from './database/DBAgency';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBAgency).toConstantValue(DBAgency);

export const AgencyRepository: agencyRespository = container.get(agencyRespository);
export const AgencyService: agencyService = container.get(agencyService);
