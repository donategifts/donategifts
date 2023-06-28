const AgencyRepository = require('../db/repository/AgencyRepository');

module.exports = class Permissions {
	static redirectLogin(req, res, next) {
		if (!req.session?.user) {
			return res.redirect('/login');
		}

		next();
	}

	static redirectProfile(req, res, next) {
		if (req.session?.user) {
			return res.redirect('/profile');
		}

		next();
	}

	static async isAdminOrAgency(req, res, next) {
		const { user } = req.session;

		if (!user) {
			return res.status(403).redirect('/login');
		}

		if (user.userRole === 'admin') {
			return next();
		}

		if (user.userRole === 'partner') {
			const agency = await new AgencyRepository().getAgencyByUserId(user._id);

			if (!agency?.isVerified) {
				return res.status(403).redirect('/profile');
			}
		} else {
			return res.status(403).redirect('/profile');
		}

		next();
	}

	static checkUserVerification(req, res, next) {
		const { user } = req.session;
		if (!user) {
			return res.status(403).redirect('/login');
		}

		if (!user.emailVerified) {
			return res.status(403).redirect('/profile');
		}

		next();
	}

	static checkAdminPermission(req, res, next) {
		const { user } = req.session;

		if (!user) {
			return res.status(403).redirect('/login');
		}

		if (user.userRole !== 'admin') {
			return res.status(404).render('error/404');
		}

		next();
	}
};
