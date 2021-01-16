import { Container } from 'inversify';
import { PaymentService as paymentService } from './PaymentService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const PaymentService: paymentService = container.get(paymentService);
