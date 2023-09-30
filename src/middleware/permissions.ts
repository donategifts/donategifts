import type { Request, Response, NextFunction } from 'express';

import AgencyRepository from '../db/repository/AgencyRepository';

export default class Permissions {
	static redirectLogin(_req: Request, res: Response, next: NextFunction) {
		if (!res.locals.user) {
			return res.redirect('/login');
		}

		return next();
	}

	static redirectProfile(_req: Request, res: Response, next: NextFunction) {
		if (res.locals.user) {
			return res.redirect('/profile');
		}

		return next();
	}

	static async isAdminOrAgency(_req: Request, res: Response, next: NextFunction) {
		const { user } = res.locals;

		if (!user) {
			return res.redirect('/login');
		}

		if (user.userRole === 'admin') {
			return next();
		}

		if (user.userRole === 'partner') {
			const agency = await new AgencyRepository().getAgencyByUserId(user._id);

			if (!agency?.isVerified) {
				return res.redirect('/profile');
			}
		} else {
			return res.redirect('/profile');
		}

		return next();
	}

	static checkUserVerification(_req: Request, res: Response, next: NextFunction) {
		const { user } = res.locals;
		if (!user) {
			return res.redirect('/login');
		}

		if (!user.emailVerified) {
			return res.redirect('/profile');
		}

		return next();
	}

	static checkAdminPermission(req: Request, res: Response, next: NextFunction) {
		const { user } = res.locals;

		if (!user) {
			return res.redirect('/login');
		}

		if (user.userRole !== 'admin') {
			return res.status(404).render('error/404');
		}

		return next();
	}
}
