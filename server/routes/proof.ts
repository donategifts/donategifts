import express from 'express';

import ProofController from '../controller/proof';

const proofController = new ProofController();

const router = express.Router();

router.get('/', proofController.handleGetIndex);

export default router;
