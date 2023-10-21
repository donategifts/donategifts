import express, { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import { database } from '../db/postgresconnection';
import VerificationTokensRepository from '../db/repository/postgres/VerificationTokensRepository';
import logger from '../helper/logger';
import Validations from '../middleware/validations';

const router = express.Router();

const verificationTokensRepository = new VerificationTokensRepository(database);

router.get('/reset', (_req: Request, res: Response, _next: NextFunction) => {
	res.render('pages/passwordreset');
});

// TODO: is allowed to stay as is for now, handles the render logic for the password reset page
router.get(
	'/reset/:token',
	Validations.getPasswordResetValidationRules(),
	Validations.validate,
	async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const { user_id, expires_at } = await verificationTokensRepository.getByToken(
				req.params.token,
			);

			if (user_id) {
				if (moment(expires_at) > moment()) {
					return res.render('pages/passwordresetconfirmation', {
						token: req.params.token,
					});
				} else {
					logger.warn('[passwordroute] Password token expired');
					return res.redirect('/password/reset');
				}
			}

			logger.error('[passwordroute] User not found');
			return res.redirect('/');
		} catch (error) {
			logger.error('[passwordroute]', error);
			return res.status(500).render('pages/error/500', {
				error,
			});
		}
	},
);

export default router;
