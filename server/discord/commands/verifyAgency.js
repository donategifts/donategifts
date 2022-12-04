const { SlashCommandBuilder } = require('discord.js');
const AgencyRepository = require('../../db/repository/AgencyRepository');
const log = require('../../helper/logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verifyagency')
		.setDescription('Returns wether or not the agency was verified!')
		.addStringOption((option) =>
			option
				.setName('agencyid')
				.setDescription('The db id mentioned in the webhook notification')
				.setRequired(true),
		),

	async execute(interaction) {
		await interaction.deferReply();

		const { value: id } = interaction.options.get('agencyid');

		try {
			const result = await AgencyRepository.verifyAgency(id);
			await interaction.editReply(`Agency ${result.agencyName} verified!`);
		} catch (error) {
			log.error(error);
			await interaction.editReply('Something went wrong, please check the logs');
		}
	},
};
