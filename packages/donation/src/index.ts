import { Container } from 'inversify';
import { DonationRepository as donationRespository } from './database/DonationRepository';
import { DonationService as donationService } from './DonationService';
import { DBDonation } from './database/DBDonation';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBDonation).toConstantValue(DBDonation);

export const DonationService: donationService = container.get(donationService);
export const DonationRepository: donationRespository = container.get(donationRespository);
