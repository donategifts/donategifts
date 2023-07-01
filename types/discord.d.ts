import { Collection } from 'discord.js';

declare module 'discord.js' {
	interface Client {
		commands: Collection<any, any>;
	}
}
