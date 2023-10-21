import express from 'express';

const router = express.Router();

router.get('/', (_req, res, _next) => {
	return res.render('pages/home');
});

export default router;
