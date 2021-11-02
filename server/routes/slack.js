const express = require('express');
const log = require('../helper/logger');
const AgencyRepository = require('../db/repository/AgencyRepository');

const router = express.Router();

router.post('/verify-agency', async (req, res) => {
  try {
    await AgencyRepository.verifyAgency(JSON.parse(req.body.payload).actions.value);
  
    res.sendStatus(200);
  } catch(error) {
    log.error(error);
    res.send({
      "response_type": "ephemeral",
      "replace_original": false,
      "text": "Sorry, that didn't work. Please try again."
    })
  }
});

module.exports = router;