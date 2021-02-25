import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
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

export const prisma = new PrismaClient();
export const MongooseConnection: mongooseConnection = container.get(mongooseConnection);
