import { Container } from 'inversify';
import { StorageService as storageService, IS3Config } from './StorageService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

const s3Config: IS3Config = {
	accessKeyId: process.env.AWS_KEY!,
	secretAccessKey: process.env.AWS_SECRET!,
	bucket: process.env.S3BUCKET!,
};

container.bind<IS3Config>('AmazonS3Config').toConstantValue(s3Config);

export const StorageService: storageService = container.get(storageService);
