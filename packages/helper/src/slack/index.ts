import axios from 'axios';
import { ISlackFeedbackMsg } from './types/ISlackFeedbackMsg';
import { IDonationSlack } from './types/IDonationSlack';
import { logger } from '../logger';

async function sendSlackFeedbackMessage(slackEmail: ISlackFeedbackMsg): Promise<boolean> {
	const { name, email, subject, message } = slackEmail;
	const slackMessage: {
		blocks: {
			type: string;
			text: {
				type: string;
				text: string;
			};
		}[];
	} = {
		blocks: [],
	};

	if (process.env.NODE_ENV !== 'production') {
		slackMessage.blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '------------- messaging from testing / local environment -------------',
			},
		});
	}

	if (name) {
		slackMessage.blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `User: ${name}`,
			},
		});
	}

	if (email) {
		slackMessage.blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `Email: ${email}`,
			},
		});
	}

	if (subject) {
		slackMessage.blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `Subject: ${subject}`,
			},
		});
	}

	if (message) {
		slackMessage.blocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: message,
			},
		});
	}

	if (slackMessage.blocks.length > 0) {
		try {
			await axios({
				method: 'POST',
				url: String(process.env.SLACK_INTEGRATION),
				headers: {
					'Content-Type': 'application/json',
				},
				data: JSON.stringify(slackMessage),
			});

			return true;
		} catch (error) {
			throw new Error(`Failed to send slack message: ${error}`);
		}
	}
	return false;
}

async function sendDonationNotificationToSlack(donationInfo: IDonationSlack): Promise<boolean> {
	const { service, donor, wishCard, userDonation, amount } = donationInfo;
	try {
		await axios({
			method: 'POST',
			url: String(process.env.SLACK_INTEGRATION_DONATION),
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				text: `${process.env.NODE_ENV} New ${service} Donation by ${
					donor.fName
				} ${donor.lName.substring(0, 1)} for ${
					wishCard.childFirstName
				} ${wishCard.childLastName.substring(0, 1)} details: ${
					process.env.BASE_URL
				}/wishcards/admin/${wishCard._id}, amount: ${amount} with ${userDonation || 0.0} for us`,
			}),
		});

		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export { sendSlackFeedbackMessage, sendDonationNotificationToSlack, IDonationSlack };
