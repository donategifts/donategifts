const express = require('express');
const log = require('../helper/logger');
const AgencyRepository = require('../db/repository/AgencyRepository');
const UserRepository = require('../db/repository/UserRepository');
const {
  sendAgencyVerificationNotificationSuccess,
  sendAgencyVerifiedMail,
} = require('../helper/messaging');

const router = express.Router();

async function verifyAgency(payload, res) {
  try {
    const agency = await AgencyRepository.verifyAgency(payload.actions[0].value);

    const accountManager = await UserRepository.getUserByObjectId(agency.accountManager);

    await sendAgencyVerifiedMail(accountManager.email);

    return await sendAgencyVerificationNotificationSuccess({
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
}

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res) => {
  const payload = JSON.parse(req.body.payload);

  if (payload && payload.callback_id) {
    if (payload.callback_id === 'agency_verify') {
      await verifyAgency(payload, res);
    }
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/', (req, res) => {
  log.info(req.body);
});

module.exports = router;
