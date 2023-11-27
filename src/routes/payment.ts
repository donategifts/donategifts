import express from 'express';
import moment from 'moment';

import ChildrenRepository from '../db/repository/postgres/ChildrenRepository';
import ItemsRepository from '../db/repository/postgres/ItemsRepository';
import WishcardsRepository from '../db/repository/postgres/WishCardsRepository';
import Permissions from '../middleware/permissions';

const router = express.Router();

router.get('/success/:id&:totalAmount', Permissions.redirectLogin, async (req, res, next) => {
    try {
        const { id, totalAmount } = req.params;
        const { item_id, child_id } = await WishcardsRepository.getById(id);
        const item = await ItemsRepository.getById(item_id);
        const child = await ChildrenRepository.getById(child_id);

        const donationInformation = {
            email: res.locals.user.email,
            totalAmount,
            orderDate: moment(Date.now()).format('MMM D YYYY'),
            itemName: item.name,
            childName: child.name,
        };

        return res.render('pages/payment/success', {
            donationInformation,
        });
    } catch (error) {
        return next(error);
    }
});

export default router;
