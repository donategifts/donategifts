import type { TypeObjectId } from '../generic';
import type { IUser } from '../user';
import type { IWishCard } from '../wishcard';

/** tsoaModel */
export interface IMessage {
	_id: TypeObjectId<IMessage>;
	messageFrom: TypeObjectId<IUser>;
	messageTo: TypeObjectId<IWishCard>;
	message: string;
	createdAt: Date;
}
