const express = require('express');

const ProofController = require('../controller/proof');

const proofController = new ProofController();

const router = express.Router();

router.get('/', proofController.handleGetIndex);

module.exports = router;
