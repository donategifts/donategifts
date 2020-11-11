const express = require('express');

const router = express.Router();
const log = require('../helper/logger');

router.get('/', (req, res) => {
  try {
    res.status(200).render('faq', { user: res.locals.user });
  } catch (error) {
    log.error(req, error);
  }
});

module.exports = router;
