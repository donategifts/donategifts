const express = require('express');
const log = require('../helper/logger');
const AgencyRepository = require('../db/repository/AgencyRepository');
const { sendAgencyVerificationNotificationSuccess } = require('../helper/messaging');

const router = express.Router();

router.post('/verify-agency', async (req, res) => {
  const payload = JSON.parse(req.body.payload);

  try {
    const agency = await AgencyRepository.verifyAgency(payload.actions.value);

    await sendAgencyVerificationNotificationSuccess({
      agency,
      user: payload.user.name,
      responseUrl: payload.response_url,
    });
  } catch (error) {
    log.error(error);
    res.send({
      response_type: 'ephemeral',
      replace_original: false,
      text: "Sorry, that didn't work. Please try again.",
    });
  }
});

module.exports = router;
