import axios from 'axios';
import { CustomError } from './customError';

export async function sendSlackFeedbackMessage({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
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
        url: `${process.env.SLACK_INTEGRATION}`,
        data: slackMessage,
      });
    } catch (error) {
      throw new CustomError({
        message: 'Failed to send slack notification',
        code: 'SlackMessageError',
        status: 400,
        error,
      });
    }
  }
}

export async function sendDonationNotificationToSlack({
  service,
  userDonation,
  donor,
  wishCard,
  amount,
}: {
  service: string;
  userDonation: number;
  donor: { fName: string; lName: string };
  wishCard: { childFirstName: string; childLastName: string; id: number };
  amount: number;
}): Promise<void> {
  try {
    await axios({
      method: 'POST',
      url: `${process.env.SLACK_INTEGRATION_DONATION}`,
      data: JSON.stringify({
        text: `${process.env.NODE_ENV} New ${service} Donation by ${
          donor.fName
        } ${donor.lName.substring(0, 1)} for ${
          wishCard.childFirstName
        } ${wishCard.childLastName.substring(0, 1)} details: ${
          process.env.BASE_URL
        }/wishcards/admin/${
          wishCard.id
        }, amount: ${amount} with ${userDonation} for us`,
      }),
    });
  } catch (error) {
    throw new CustomError({
      message: 'Failed to send slack notification',
      code: 'SlackMessageError',
      status: 400,
      error,
    });
  }
}
