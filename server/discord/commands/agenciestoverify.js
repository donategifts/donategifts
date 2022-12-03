const { SlashCommandBuilder } = require('discord.js');
const AgencyRepository = require('../../db/repository/AgencyRepository');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('agenciestoverify')
    .setDescription('Replies with all unverified agencies!'),

  async execute(interaction) {
    await interaction.deferReply();

    const result = await AgencyRepository.getUnverifiedAgencies();

    await interaction.editReply(result.toString());
  },
};
