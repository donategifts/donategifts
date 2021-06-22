import { inject, injectable } from 'inversify';
import { WishCardRepository } from './database/WishCardRepository';

@injectable()
export class WishCardService {
	constructor(@inject(WishCardRepository) private wishCardRepository: WishCardRepository) {}
}
