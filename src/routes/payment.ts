import express from 'express';
import moment from 'moment';

import { database } from '../db/postgresconnection';
import ChildrenRepository from '../db/repository/postgres/ChildrenRepository';
import ItemsRepository from '../db/repository/postgres/ItemsRepository';
import WishcardsRepository from '../db/repository/postgres/WishCardsRepository';
import Permissions from '../middleware/permissions';

const router = express.Router();
const wishcardsRepository = new WishcardsRepository(database);
const itemsRepository = new ItemsRepository(database);
const childrenRepository = new ChildrenRepository(database);

router.get('/success/:id&:totalAmount', Permissions.redirectLogin, async (req, res, next) => {
	try {
		const { id, totalAmount } = req.params;
		const { item_id, child_id } = await wishcardsRepository.getById(id);
		const item = await itemsRepository.getById(item_id);
		const child = await childrenRepository.getById(child_id);

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
