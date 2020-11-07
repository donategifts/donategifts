import axios from 'axios';

async function sendSlackFeedbackMessage(
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<boolean> {
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
        text: '------------- Message from testing / local environment -------------',
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

export { sendSlackFeedbackMessage };
