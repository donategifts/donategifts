const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('agenciestoverify')
    .setDescription('Replies with all unverified agencies!'),

  async execute(interaction) {
    await interaction.reply('this should be the result');
  },
};
