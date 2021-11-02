const express = require('express');
const AgencyRepository = require('../db/repository/AgencyRepository');
const log = require('../helper/logger');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.post('/verify-agency', async (req, _res) => {
  const { value } = req.body;
  log.info(value);
  await AgencyRepository.verifyAgency(value);
});