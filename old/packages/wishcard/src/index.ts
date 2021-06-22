import { Container } from 'inversify';
import { WishCardRepository as wishCardRepository } from './database/WishCardRepository';
import { WishCardService as wishCardService } from './WishCardService';
import { DBWishCard } from './database/DBWishCard';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

container.bind(DBWishCard).toConstantValue(DBWishCard);

export const WishCardRepository: wishCardRepository = container.get(wishCardRepository);
export const WishCardService: wishCardService = container.get(wishCardService);
