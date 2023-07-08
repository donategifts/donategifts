import fs from 'fs';
import path from 'path';

import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

import log from '../helper/logger';

export default class DGBot {
	private commandsPath = '';

	private commandFiles: string[] = [];

	constructor(private readonly token: string, private readonly clientId: string) {
		this.getCommands();
	}

	private getCommands() {
		this.commandsPath = path.join(__dirname, 'commands');
		this.commandFiles = fs.readdirSync(this.commandsPath);
	}

	async initClient() {
		const client = new Client({ intents: [GatewayIntentBits.Guilds] });

		client.commands = new Collection();

		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = await import(`${filePath}`);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
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

		client.login(this.token);
	}

	async refreshCommands() {
		const commands: string[] = [];

		for (const file of this.commandFiles) {
			const command = await import(`./commands/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '10' }).setToken(this.token);

		try {
			log.info(`Started refreshing ${commands.length} application (/) commands.`);

			const data = await rest.put(Routes.applicationCommands(this.clientId), {
				body: commands,
			});

			log.info(`Successfully reloaded ${(data as []).length} application (/) commands.`);
		} catch (error) {
			log.error(error);
		}
	}
}
