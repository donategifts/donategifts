const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const path = require('path');
const fs = require('fs');
const log = require('../helper/logger');

const initClient = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.commands = new Collection();

  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  client.once(Events.ClientReady, (c) => {
    log.info(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

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

  client.login(process.env.DISCORD_TOKEN);
};

const refreshCommands = async () => {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    log.info(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });

    log.info(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    log.error(error);
  }
};

module.exports = {
  Bot: {
    initClient,
    refreshCommands,
  },
};
