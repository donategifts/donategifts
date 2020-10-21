/*
 * Author: Stacy Sealky Lee
 * Class: CSC 337
 * Type: Final Project
 * FileName: controllers/email.js
 * FileDescription:
 *      When user fills out the 'Contact' form in about.html,
 *      it will use nodemailer and mailgun to send the user's message
 *      to the mailgun authorized email address
 *      all the req.body data from the 'Contact' form will be saved in our 'contacts' DB collection.
 *      Contact model lives in the models/Contact.js
 */
// NPM DEPENDENCIES
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { log } = require('../helper/logger');

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
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    const account = await nodemailer.createTestAccount();

    if (account) {
      return nodemailer.createTransport({
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
  } else {
    const auth = {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
    };

    return nodemailer.createTransport(mailGun(auth));
  }
};

// cb is callback, cb(err, null) means if err, get err, else null
// IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
const sendMail = async (from, to, subject, message, attachments = undefined) => {
  log('SENDMAIL');
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

      log(data);
      if (!data) {
        return { success: false };
      }
      if (process.env.NODE_ENV === 'development') {
        log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
        return { success: true, data: nodemailer.getTestMessageUrl(data) };
      }
      return { success: true, data: '' };
    }
    return { success: false };
  } catch (e) {
    log(e);
  }
};

const sendVerificationEmail = async (to, hash) => {
  const body = template
    .replace('%linkplaceholder%', `${process.env.BASE_URL}/users/verify/${hash}`)
    .replace('%headerPlaceHolder%', 'Verify Your Email Account')
    .replace('%titlePlaceHolder%', 'Thank you for creating an account!')
    .replace(
      '%bodyPlaceHolder%',
      'Please confirm your email address to continue using our services.',
    )
    .replace('%buttonText%', 'Confirm Your Email');

  return sendMail(
    process.env.DEFAULT_EMAIL,
    to,
    'Donate-gifts.com Email verification',
    body,
    templateAttachments,
  );
};

const sendPasswordResetMail = async (to, hash) => {
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
    templateAttachments,
  );
};

const createEmailVerificationHash = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 18; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

async function sendSlackFeedbackMessage(name, email, subject, message) {
  const slackMessage = {
    text: '@channel',
    blocks: [],
  };

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
        url: 'https://hooks.slack.com/services/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',
        header: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(slackMessage),
      });
    } catch (error) {
      log(`Failed to send slack message: ${error}`);
    }
  }
}

module.exports = {
  sendMail,
  sendSlackFeedbackMessage,
  createEmailVerificationHash,
  sendVerificationEmail,
  sendPasswordResetMail,
};
