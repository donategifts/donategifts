import express from 'express';

const router = express.Router();

router.get('/', (_req, res, _next) => res.render('pages/community'));

export default router;
