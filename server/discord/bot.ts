// TODO: fix ts-ignore
import fs from 'fs';
import path from 'path';

import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

import log from '../helper/logger';

export default class DGBot {
	private commandsPath = '';

	private commandFiles: string[] = [];

	constructor() {
		this.getCommands();
	}

	private getCommands() {
		this.commandsPath = path.join(__dirname, 'commands');
		this.commandFiles = fs.readdirSync(this.commandsPath);
	}

	private isValidInteractionRequest(interaction) {
		return interaction.isChatInputCommand(); // || interaction.isButton();
	}

	async initClient() {
		const client = new Client({ intents: [GatewayIntentBits.Guilds] });

		// @ts-ignore
		client.commands = new Collection();

		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				// @ts-ignore
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
			if (!this.isValidInteractionRequest(interaction)) {
				return;
			}

			// @ts-ignore
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				// @ts-ignore
				log.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				log.error(error);
				// @ts-ignore
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		});

		client.login(process.env.DISCORD_TOKEN);
	}

	async refreshCommands() {
		const commands = [];

		for (const file of this.commandFiles) {
			const command = require(`./commands/${file}`);
			// @ts-ignore
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '10' }).setToken(String(process.env.DISCORD_TOKEN));

		try {
			log.info(`Started refreshing ${commands.length} application (/) commands.`);

			const data = await rest.put(
				Routes.applicationCommands(String(process.env.DISCORD_CLIENT_ID)),
				{
					body: commands,
				},
			);

			log.info(`Successfully reloaded ${(data as []).length} application (/) commands.`);
		} catch (error) {
			log.error(error);
		}
	}
}
