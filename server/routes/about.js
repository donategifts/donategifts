/*
    serving all 'about' related routes
    '/about' is already mounted, so no need to start with it for each route.
*/

// NPM DEPENDENCIES
const express = require('express');

const router = express.Router();

// IMPORT WISHCARD MODEL
const ContactRepository = require('../db/repository/ContactRepository');
// LOAD EMAIL SENDING FUNCTION
const { sendMail } = require('../controller/email');
const { handleError } = require('../helper/error');
const { log } = require('../helper/logger');

// @desc    Render about.html
// @route   GET '/about'
// @access  Public
// @tested 	Not yet
router.get('/', (req, res) => {
  try {
    res.status(200).render('about', { user: res.locals.user });
  } catch (error) {
    log(req, error);
  }
});

// @desc    saves user data and sends an email to us
// @route   POST '/about/email'
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

    const mailResponse = await sendMail(
      contact.email,
      'stacy.sealky.lee@gmail.com',
      contact.subject,
      contact.message,
    );

    if (mailResponse.error) {
      log(req, mailResponse.error);
    } else {
      log(req, 'email successfully sent');
    }

    return res.status(201).redirect('/');
  } catch (error) {
    handleError(res, 400, 'ERROR!');
  }
});

module.exports = router;
