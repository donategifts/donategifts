import { TypeObjectId } from '../generic';

/** tsoaModel */
export interface IContact {
	_id: TypeObjectId<IContact>;
	name: string;
	email: string;
	subject: string;
	message: string;
	sentDate: Date;
}
