import { createTestAccount, createTransport, getTestMessageUrl } from 'nodemailer';
import * as mailGun from 'nodemailer-mailgun-transport';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../common';

const template = fs.readFileSync(path.resolve(__dirname, '../resources/email/emailTemplate.html'), {
  encoding: 'utf-8',
});
const templateAttachments = [
  {
    filename: 'instagram2x.png',
    path: path.resolve(__dirname, '../resources/email/instagram2x.png'),
    cid: 'instagram2x.png', // same cid value as in the html img src
  },
  {
    filename: 'website2x.png',
    path: path.resolve(__dirname, '../resources/email/website2x.png'),
    cid: 'website2x.png', // same cid value as in the html img src
  },
  {
    filename: 'mail2x.png',
    path: path.resolve(__dirname, '../resources/email/mail2x.png'),
    cid: 'mail2x.png', // same cid value as in the html img src
  },
  {
    filename: 'new-donate-gifts-logo-2.png',
    path: path.resolve(__dirname, '../resources/email/new-donate-gifts-logo-2.png'),
    cid: 'new-donate-gifts-logo-2.png', // same cid value as in the html img src
  },
  {
    filename: 'Img1_2x.jpg',
    path: path.resolve(__dirname, '../resources/email/Img1_2x.jpg'),
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

    // LIVE data
  }
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
  from: string | undefined,
  to: string,
  subject: string,
  message: string,
  attachments = undefined,
): Promise<{ success: boolean; data?: string | boolean }> => {
  const transporter = await getTransport();

  if (transporter) {
    const mailOptions = {
      from,
      to,
      subject,
      html: message,
      attachments,
    };

    try {
      const data = await transporter.sendMail(mailOptions);

      if (!data) {
        return { success: false, data: '' };
      }
      if (process.env.NODE_ENV === 'development') {
        logger.info('Preview URL: %s', getTestMessageUrl(data));
        return { success: true, data: getTestMessageUrl(data) };
      }
      return { success: true, data: '' };
    } catch (error) {
      throw new Error(`Failed to send mail: ${error}`);
    }
  }
  return { success: false, data: '' };
};

const sendVerificationEmail = async (
  to: string,
  hash: string,
): Promise<{
  success: boolean;
  data?: string | boolean;
}> => {
  const body = template
    .replace('%linkplaceholder%', `${process.env.BASE_URL}/users/verify/${hash}`)
    .replace('%headerPlaceHolder%', 'Verify Your Email Account')
    .replace('%titlePlaceHolder%', 'Thank you for creating an account!')
    .replace('%bodyPlaceHolder%', 'Please confirm your email address to continue using our services.')
    .replace('%buttonText%', 'Confirm Your Email');

  return sendMail(
    process.env.DEFAULT_EMAIL,
    to,
    'Donate-gifts.com Email verification',
    body,
    (templateAttachments as unknown) as undefined,
  );
};

const sendPasswordResetMail = async (
  to: string,
  hash: string,
): Promise<{
  success: boolean;
  data?: string | boolean;
}> => {
  const body = template
    .replace('%linkplaceholder%', `${process.env.BASE_URL}/users/password/reset/${hash}`)
    .replace('%titlePlaceHolder%', 'Your password reset request')
    .replace('%headerPlaceHolder%', '')
    .replace('%bodyPlaceHolder%', 'Please click the button below to reset your password')
    .replace('%buttonText%', 'Reset Password');

  return sendMail(
    process.env.DEFAULT_EMAIL,
    to,
    'Donate-gifts.com Password Reset',
    body,
    (templateAttachments as unknown) as undefined,
  );
};

const createEmailVerificationHash = (): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 18; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export { sendMail, createEmailVerificationHash, sendVerificationEmail, sendPasswordResetMail };
