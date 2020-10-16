/*
    serving all 'about' related routes
    '/about' is already mounted, so no need to start with it for each route.
*/

// NPM DEPENDENCIES
const express = require('express');

const router = express.Router();

// IMPORT WISHCARD MODEL
const Contact = require('../models/Contact');

// LOAD EMAIL SENDING FUNCTION
const { sendMail } = require('../controllers/email');
const { handleError } = require('../middleware/error');

// @desc    Render about.html
// @route   GET '/about'
// @access  Public
// @tested 	Not yet
router.get('/', (_req, res) => {
  try {
    res.status(200).render('about', { user: res.locals.user });
  } catch (error) {
    console.log(error);
  }
});

// @desc    saves user data and sends an email to us
// @route   POST '/about/email'
// @access  Public
// @tested 	Not yet
router.post('/email', async (req, res) => {
  try {
    const c = new Contact();
    c.name = req.body.name;
    c.email = req.body.email;
    c.subject = `${req.body.subject} | send from ${c.name}`;
    c.message = req.body.message;
    const mailResponse = await sendMail(
      c.email,
      'stacy.sealky.lee@gmail.com',
      c.subject,
      c.message
    );

    if (mailResponse.error) {
      console.log(mailResponse.error);
    } else {
      console.log('email successfully sent');
    }
    c.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('contact successfully saved to DB');
        return res.status(201).redirect('/');
      }
    });
  } catch (error) {
    handleError(res, 400, 'ERROR!');
  }
});

module.exports = router;
