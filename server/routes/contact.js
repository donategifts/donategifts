const express = require('express');

const router = express.Router();
const log = require('../helper/logger');
// IMPORT WISHCARD MODEL
const ContactRepository = require('../db/repository/ContactRepository');
// LOAD EMAIL SENDING FUNCTION
const { sendMail, sendSlackFeedbackMessage } = require('../helper/messaging');
const { handleError } = require('../helper/error');

router.get('/', (req, res) => {
  try {
    res.status(200).render('contact', { user: res.locals.user });
  } catch (error) {
    log.error(req, error);
  }
});

// @desc    saves user data and sends an email to us
// @route   POST '/contact/email'
// @access  Public
// @tested 	Not yet
router.post('/email', async (req, res) => {
  try {
    const contact = await ContactRepository.createNewContact({
      name: req.body.name,
      email: req.body.email,
      subject: `${req.body.subject} | send from ${req.body.name}`,
      message: req.body.message,
    });

    const mailResponse = await sendMail(contact.email, 'stacy.sealky.lee@gmail.com', contact.subject, contact.message);

    if (mailResponse.error) {
      log.error(req, mailResponse.error);
    } else {
      log.info(req, 'email successfully sent');
    }

    return res.status(201).redirect('/');
  } catch (error) {
    handleError(res, 400, 'Failed to send Email!');
  }
});

router.post('/customer-services', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const done = await sendSlackFeedbackMessage(name, email, subject, message);

  if (done) {
    return res.status(200).send({
      success: true,
    });
  }

  return handleError(res, 400, 'Failed to send feedback! Please try again in a few minutes!');
});

module.exports = router;
