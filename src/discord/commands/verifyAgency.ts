import { SlashCommandBuilder } from 'discord.js';

import AgencyRepository from '../../db/repository/AgencyRepository';
import log from '../../helper/logger';
import Messaging from '../../helper/messaging';

const data = new SlashCommandBuilder()
	.setName('verifyagency')
	.setDescription('Returns wether or not the agency was verified!')
	.addStringOption((option) =>
		option
			.setName('agencyid')
			.setDescription('The db id mentioned in the webhook notification')
			.setRequired(true),
	);

const execute = async (interaction) => {
	await interaction.deferReply();

	const { value: id } = interaction.options.get('agencyid');

	try {
		const result = await new AgencyRepository().verifyAgency(String(id));
		await Messaging.sendAgencyVerifiedMail(result!.accountManager.email);
		await interaction.editReply(`Agency ${result?.agencyName} verified and email is sent!`);
	} catch (error) {
		log.error(error);
		await interaction.editReply('Something went wrong, please check the logs');
	}
};

export { data, execute };
