import express, { NextFunction, Request, Response } from 'express';
import { Selectable } from 'kysely';

import { database } from '../db/postgresconnection';
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

const usersRepository = new UsersRepository(database);
const agenciesRepository = new AgenciesRepository(database);
const ordersRepository = new OrdersRepository(database);
const childrenRepository = new ChildrenRepository(database);
const itemsRepository = new ItemsRepository(database);
const wishcardsRepository = new WishcardsRepository(database);
const verificationTokensRepository = new VerificationTokensRepository(database);

router.get(
    '/verify/:token',
    Validator.verifyHashValidationRules(),
    Validator.validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokenData = await verificationTokensRepository.getByToken(req.params.token);
            let user = await usersRepository.getById(tokenData.user_id);

            if (user) {
                user = await usersRepository.updateVerificationStatus(user.id, true);

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
            agency = await agenciesRepository.getByAccountManagerId(res.locals.user.id);
        } catch (error) {
            logger.error('Error getting agency by account manager id', error);
        }
    }

    return res.render('profile/overview', {
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
                const wishcard = await wishcardsRepository.getById(order.wishcard_id);
                const child = await childrenRepository.getById(wishcard.child_id);
                const item = await itemsRepository.getById(wishcard.item_id);

                donations.push({
                    order,
                    child,
                    item,
                    user,
                });
            }
        };

        if (user.role === 'partner') {
            const agency = await agenciesRepository.getByAccountManagerId(user.id);
            const orders = await ordersRepository.getByAgencyId(agency.id);

            await addDonations(orders);
        } else {
            const orders = await ordersRepository.getByDonorId(user.id);

            await addDonations(orders);
        }

        return res.render('pages/profile/history', { donations });
    } catch (error) {
        return next(error);
    }
});

router.get('/logout', Permissions.redirectLogin, Utils.logoutUser);

export default router;
