import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.render('pages/home');
});

export default router;
