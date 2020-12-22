import { Container } from 'inversify';
import { MongooseConnection as mongooseConnection } from './MongooseConnection';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export {
	Document,
	Schema,
	model,
	models,
	Model,
	Types,
	Connection,
	MongooseFilterQuery,
} from 'mongoose';

export const MongooseConnection: mongooseConnection = container.get(mongooseConnection);
