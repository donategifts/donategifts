import { Container } from 'inversify';
import { StorageService as storageService } from './StorageService';

const container = new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });

export const StorageService: storageService = container.get(storageService);
