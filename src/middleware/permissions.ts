import type { Request, Response, NextFunction } from 'express';

import { database } from '../db/postgresconnection';
import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import logger from '../helper/logger';

export default class Permissions {
	static redirectLogin(req: Request, res: Response, next: NextFunction) {
		if (!req.session.user) {
			return res.redirect('/login');
		}

		return next();
	}

	static redirectProfile(req: Request, res: Response, next: NextFunction) {
		if (req.session.user) {
			return res.redirect('/profile');
		}

		return next();
	}

	static async isAdminOrAgency(req: Request, res: Response, next: NextFunction) {
		const user = req.session.user;

		if (!user) {
			return res.redirect('/login');
		}

		if (user.role === 'admin') {
			return next();
		}

		if (user.role === 'partner') {
			try {
				const agency = await new AgenciesRepository(database).getByAccountManagerId(
					user.id,
				);

				if (!agency.is_verified) {
					return res.redirect('/profile');
				}
			} catch (error) {
				logger.error('[Permissions] isAdminOrAgency: ', error);

				return res.redirect('/profile');
			}
		} else {
			return res.redirect('/profile');
		}

		return next();
	}

	static checkUserVerification(req: Request, res: Response, next: NextFunction) {
		const user = req.session.user;

		if (!user) {
			return res.redirect('/login');
		}

		if (!user.is_verified) {
			return res.redirect('/profile');
		}

		return next();
	}

	static checkAdminPermission(req: Request, res: Response, next: NextFunction) {
		const user = req.session.user;

		if (!user) {
			return res.redirect('/login');
		}

		if (user.role !== 'admin') {
			return res.status(404).render('error/404');
		}

		return next();
	}
}
