import { Container } from 'inversify';
import { AgencyRepository as agencyRespository } from './AgencyRepository';
import { DBAgency } from './DBAgency';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBAgency).toConstantValue(DBAgency);

export const AgencyRepository: agencyRespository = container.get(agencyRespository);
