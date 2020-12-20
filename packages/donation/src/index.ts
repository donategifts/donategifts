import { Container } from 'inversify';
import { DonationRepository as donationRespository } from './database/DonationRepository';
import { DonationService as donationService } from './DonationService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const DonationService: donationService = container.get(donationService);
export const DonationRepository: donationRespository = container.get(donationRespository);
