import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '@donategifts/user-data';
import { AgencyRepository } from '@donategifts/agency-data';

const extractSessionUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	if (req.session) {
		const { user } = req.session;
		if (user) {
			const result = await UserRepository.getUserById(user._id);
			res.locals.user = result;
			req.session.user = result;
			if (user.userRole === 'partner') {
				const agency = await AgencyRepository.getAgencyByUserId(user._id);
				if (agency !== null) {
					res.locals.agency = agency;
					req.session.agency = agency;
				}
			}
		}
	}
	next();
};

export default extractSessionUser;
