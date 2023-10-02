import fs from 'fs';
import path from 'path';

import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

import log from '../helper/logger';

export default class DGBot {
	private commands: string[] = [];

	constructor(
		private readonly token: string,
		private readonly clientId: string,
	) {}

	async initClient() {
		const client = new Client({ intents: [GatewayIntentBits.Guilds] });

		const commandsPath = path.join(__dirname, 'commands');
		const commandFiles = fs.readdirSync(commandsPath);

		client.commands = new Collection();

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				this.commands.push(command.data.toJSON());
			} else {
				log.warn(
					`The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		}

		client.once(Events.ClientReady, (c) => {
			log.info(`Ready! Logged in as ${c.user.tag}`);
		});

		client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isChatInputCommand()) {
				return;
			}

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				log.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				log.error(error);
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		});

		await client.login(this.token);
	}

	async refreshCommands() {
		const rest = new REST({ version: '10' }).setToken(this.token);

		try {
			log.info(`Started refreshing ${this.commands.length} application (/) commands.`);

			const data = await rest.put(Routes.applicationCommands(this.clientId), {
				body: this.commands,
			});

			log.info(`Successfully reloaded ${(data as []).length} application (/) commands.`);
		} catch (error) {
			log.error(error);
		}
	}
}
