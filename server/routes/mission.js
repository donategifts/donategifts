/*
    serving all 'about' related routes
    '/about' is already mounted, so no need to start with it for each route.
*/

// NPM DEPENDENCIES
const express = require('express');

const router = express.Router();

const log = require('../helper/logger');

// @desc    Render about.html
// @route   GET '/about'
// @access  Public
// @tested 	Not yet
router.get('/', (req, res) => {
  try {
    res.status(200).render('mission', { user: res.locals.user });
  } catch (error) {
    log.error(req, error);
  }
});

module.exports = router;
