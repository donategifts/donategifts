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

const template = fs.readFileSync(path.resolve(__dirname, '../resources/email/verifyEmail.html'), {
  encoding: 'utf-8',
});

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
  console.log('SENDMAIL');
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

      console.log(data);
      if (!data) {
        return { success: false };
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
        return { success: true, data: nodemailer.getTestMessageUrl(data) };
      }
      return { success: true, data: '' };
    }
    return { success: false };
  } catch (e) {
    console.log(e);
  }
};

const sendVerificationEmail = async (to, hash) => {
  console.log('MAIL');
  const attachments = [
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

  const body = template.replace('linkplaceholder', `${process.env.BASE_URL}/users/verify/${hash}`);

  console.log('BODY');
  return sendMail(
    process.env.DEFAULT_EMAIL,
    to,
    'Donate-gifts.com Email verification',
    body,
    attachments,
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

module.exports = {
  sendMail,
  createEmailVerificationHash,
  sendVerificationEmail,
};
