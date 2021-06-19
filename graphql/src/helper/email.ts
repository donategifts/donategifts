import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';
import * as mailGun from 'nodemailer-mailgun-transport';
import { format } from 'date-fns';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import axios from 'axios';
import { CustomError } from './customError';

const template = readFileSync(
  resolve(__dirname, '../../resources/email/emailTemplate.html'),
  {
    encoding: 'utf-8',
  },
);
const donationTemplate = readFileSync(
  resolve(__dirname, '../../resources/email/donorDonationReceipt.html'),
  {
    encoding: 'utf-8',
  },
);

const donationTemplateAttachments = [
  {
    filename: 'new-donate-gifts-logo-2.png',
    path: resolve(
      __dirname,
      '../../resources/email/new-donate-gifts-logo-2.png',
    ),
    cid: 'new-donate-gifts-logo-2.png',
  },
  {
    filename: 'email-gifts-illustration-removebg-preview.png',
    path: resolve(
      __dirname,
      '../../resources/email/email-gifts-illustration-removebg-preview.png',
    ),
    cid: 'email-gifts-illustration-removebg-preview.png',
  },
  {
    filename: 'instagram2x.png',
    path: resolve(__dirname, '../../resources/email/instagram2x.png'),
    cid: 'instagram2x.png',
  },
  {
    filename: 'mail2x.png',
    path: resolve(__dirname, '../../resources/email/mail2x.png'),
    cid: 'mail2x.png',
  },
  {
    filename: 'website2x.png',
    path: resolve(__dirname, '../../resources/email/website2x.png'),
    cid: 'website2x.png',
  },
];
const templateAttachments = [
  {
    filename: 'instagram2x.png',
    path: resolve(__dirname, '../../resources/email/instagram2x.png'),
    cid: 'instagram2x.png', // same cid value as in the html img src
  },
  {
    filename: 'website2x.png',
    path: resolve(__dirname, '../../resources/email/website2x.png'),
    cid: 'website2x.png', // same cid value as in the html img src
  },
  {
    filename: 'mail2x.png',
    path: resolve(__dirname, '../../resources/email/mail2x.png'),
    cid: 'mail2x.png', // same cid value as in the html img src
  },
  {
    filename: 'new-donate-gifts-logo-2.png',
    path: resolve(
      __dirname,
      '../../resources/email/new-donate-gifts-logo-2.png',
    ),
    cid: 'new-donate-gifts-logo-2.png', // same cid value as in the html img src
  },
  {
    filename: 'Img1_2x.jpg',
    path: resolve(__dirname, '../../resources/email/Img1_2x.jpg'),
    cid: 'Img1_2x.jpg', // same cid value as in the html img src
  },
];

const getTransport = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const account = await createTestAccount();

    if (account) {
      return createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    }
  }
  // LIVE data
  const auth = {
    auth: {
      api_key: String(process.env.MAILGUN_API_KEY),
      domain: String(process.env.MAILGUN_DOMAIN),
    },
  };

  return createTransport(mailGun(auth));
};

// cb is callback, cb(err, null) means if err, get err, else null
// IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
const sendMail = async (
  from: string,
  to: string,
  subject: string,
  message: string,
  attachments?: {
    filename: string;
    path: string;
    cid: string;
  }[],
): Promise<{ success: boolean; data?: string | false }> => {
  try {
    const transporter = await getTransport();

    if (transporter) {
      const mailOptions = {
        from,
        to,
        subject,
        html: message,
        attachments,
      };

      const data = await transporter.sendMail(mailOptions);

      if (!data) {
        return { success: false };
      }
      if (process.env.NODE_ENV === 'development') {
        return { success: true, data: getTestMessageUrl(data) };
      }
      return { success: true, data: '' };
    }

    throw new CustomError({
      message: 'Failed to create Transporter',
      code: 'TransporterCreateError',
      status: 400,
    });
  } catch (error) {
    throw new CustomError({
      message: 'Failed to create Transporter',
      code: 'TransporterCreateError',
      status: 400,
      error,
    });
  }
};

export const sendDonationConfirmationMail = async ({
  email,
  firstName,
  lastName,
  childName,
  item,
  price,
  agency,
}: {
  email: string;
  firstName: string;
  lastName: string;
  childName: string;
  item: string;
  price: number;
  agency: string;
}): Promise<{
  success: boolean;
  data?: string | false;
}> => {
  const body = donationTemplate
    .replace('%firstName%', firstName)
    .replace(RegExp('%childName%', 'g'), childName)
    .replace('%fullName%', `${firstName} ${lastName}`)
    .replace('%item%', item)
    .replace('%price%', price.toString())
    .replace('%agency%', agency)
    // Jan 1st, 2020 <- date formatting
    .replace('%date%', format(new Date(), 'MMM Do, YYYY'));

  return sendMail(
    String(process.env.DEFAULT_EMAIL),
    email,
    'Donate-gifts.com Donation Receipt',
    body,
    donationTemplateAttachments,
  );
};

export const sendVerificationEmail = async ({
  to,
  hash,
}: {
  to: string;
  hash: string;
}): Promise<{
  success: boolean;
  data?: string | false;
}> => {
  const body = template
    .replace(
      '%linkplaceholder%',
      `${process.env.BASE_URL}/users/verify/${hash}`,
    )
    .replace('%headerPlaceHolder%', 'Verify Your Email Account')
    .replace('%titlePlaceHolder%', 'Thank you for creating an account!')
    .replace(
      '%bodyPlaceHolder%',
      'Please confirm your email address to continue using our services.',
    )
    .replace('%buttonText%', 'Confirm Your Email');

  return sendMail(
    String(process.env.DEFAULT_EMAIL),
    to,
    'Donate-gifts.com Email verification',
    body,
    templateAttachments,
  );
};

export const sendPasswordResetMail = async ({
  to,
  hash,
}: {
  to: string;
  hash: string;
}): Promise<{
  success: boolean;
  data?: string | false;
}> => {
  const body = template
    .replace(
      '%linkplaceholder%',
      `${process.env.BASE_URL}/users/password/reset/${hash}`,
    )
    .replace('%titlePlaceHolder%', 'Your password reset request')
    .replace('%headerPlaceHolder%', '')
    .replace(
      '%bodyPlaceHolder%',
      'Please click the button below to reset your password',
    )
    .replace('%buttonText%', 'Reset Password');

  return sendMail(
    String(process.env.DEFAULT_EMAIL),
    to,
    'Donate-gifts.com Password Reset',
    body,
    templateAttachments,
  );
};

export const createEmailVerificationHash = (): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 18; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

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
