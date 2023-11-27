import express, { NextFunction, Request, Response } from 'express';
import { Selectable } from 'kysely';

import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import ChildrenRepository from '../db/repository/postgres/ChildrenRepository';
import ItemsRepository from '../db/repository/postgres/ItemsRepository';
import OrdersRepository from '../db/repository/postgres/OrdersRepository';
import UsersRepository from '../db/repository/postgres/UsersRepository';
import VerificationTokensRepository from '../db/repository/postgres/VerificationTokensRepository';
import WishcardsRepository from '../db/repository/postgres/WishCardsRepository';
import { Agencies, Children, Items, Orders, Users } from '../db/types/generated/database';
import logger from '../helper/logger';
import Utils from '../helper/utils';
import Permissions from '../middleware/permissions';
import Validator from '../middleware/validations';

const router = express.Router();

router.get(
    '/verify/:token',
    Validator.verifyHashValidationRules(),
    Validator.validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokenData = await VerificationTokensRepository.getByToken(req.params.token);
            let user = await UsersRepository.getById(tokenData.user_id);

            if (user) {
                user = await UsersRepository.updateVerificationStatus(user.id, true);

                if (req && user) {
                    req.session.user = user;
                }

                return res.render('profile/verify');
            }

            logger.error(`Email verification failed for hash ${req.params.token}!`);
            return next();
        } catch (error) {
            logger.error(`Email verification failed for hash ${req.params.hash}!`);
            return next(error);
        }
    },
);

// ------------ only logged in users from here on ------------

router.get('/', Permissions.redirectLogin, async (req, res, _next) => {
    let agency: Selectable<Agencies> | null = null;

    if (res.locals.user.role === 'partner') {
        try {
            agency = await AgenciesRepository.getByAccountManagerId(res.locals.user.id);
        } catch (error) {
            logger.error('Error getting agency by account manager id', error);
        }
    }

    return res.render('pages/profile/overview', {
        agency,
    });
});

router.get('/history', Permissions.redirectLogin, async (_req, res, next) => {
    try {
        const user = res.locals.user;

        const donations = [] as {
            order: Selectable<Orders>;
            child: Selectable<Children>;
            item: Selectable<Items>;
            user: Selectable<Users>;
        }[];

        const addDonations = async (orders: Selectable<Orders>[]) => {
            for (const order of orders) {
                const wishcard = await WishcardsRepository.getById(order.wishcard_id);
                const child = await ChildrenRepository.getById(wishcard.child_id);
                const item = await ItemsRepository.getById(wishcard.item_id);

                donations.push({
                    order,
                    child,
                    item,
                    user,
                });
            }
        };

        if (user.role === 'partner') {
            const agency = await AgenciesRepository.getByAccountManagerId(user.id);
            const orders = await OrdersRepository.getByAgencyId(agency.id);

            await addDonations(orders);
        } else {
            const orders = await OrdersRepository.getByDonorId(user.id);

            await addDonations(orders);
        }

        return res.render('pages/profile/history', { donations });
    } catch (error) {
        return next(error);
    }
});

router.get('/logout', Permissions.redirectLogin, Utils.logoutUser);

export default router;
