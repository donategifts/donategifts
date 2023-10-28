import express from 'express';
import { Selectable } from 'kysely';

import { database } from '../db/postgresconnection';
import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';
import ChildrenRepository from '../db/repository/postgres/ChildrenRepository';
import ImagesRepository from '../db/repository/postgres/ImagesRepository';
import ItemsRepository from '../db/repository/postgres/ItemsRepository';
import MessagesRepository from '../db/repository/postgres/MessagesRepository';
import UsersRepository from '../db/repository/postgres/UsersRepository';
import WishcardsRepository from '../db/repository/postgres/WishCardsRepository';
import { Images, Messages, Users } from '../db/types/generated/database';
import Utils from '../helper/utils';
import Permissions from '../middleware/permissions';

const router = express.Router();

const usersRepository = new UsersRepository(database);
const agenciesRepository = new AgenciesRepository(database);
const itemsRepository = new ItemsRepository(database);
const childrenRepository = new ChildrenRepository(database);
const wishcardRepository = new WishcardsRepository(database);
const messagesRepository = new MessagesRepository(database);
const imagesRepository = new ImagesRepository(database);

router.get('/', (_req, res, _next) => {
	return res.render('pages/wishcards');
});

router.get('/detail', async (req, res, next) => {
	try {
		const wishcardId = req.query.id?.toString();

		if (!wishcardId) {
			throw new Error('No wishcard id provided');
		}

		const messages = [] as {
			sender: Selectable<Users>;
			message: Selectable<Messages>;
		}[];

		let childImage: Selectable<Images> | null = null;

		const wishcard = await wishcardRepository.getById(wishcardId);
		if (wishcard.image_id) {
			childImage = await imagesRepository.getById(wishcard.image_id);
		}
		const child = await childrenRepository.getById(wishcard.child_id);
		const item = await itemsRepository.getById(wishcard.item_id);

		let itemImage: Selectable<Images> | null = null;

		if (item.image_id) {
			itemImage = await imagesRepository.getById(item.image_id);
		}

		const result = (await messagesRepository.getByWishCardId(
			wishcardId,
		)) as Selectable<Messages>[];

		for (const message of result) {
			if (!message.sender_id) {
				continue;
			}

			const poster = await usersRepository.getById(message.sender_id);

			messages.push({
				sender: poster,
				message,
			});
		}

		const agency = await agenciesRepository.getByAccountManagerId(wishcard.created_by);

		let defaultMessages: string[] = [];

		if (req.session.user) {
			defaultMessages = Utils.getMessageChoices(res.locals.user.first_name, child.name);
		}

		const data = {
			wishcard,
			child,
			item,
			agency,
			messages,
			images: {
				child: childImage,
				item: itemImage,
			},
			defaultMessages,
		};

		return res.render('pages/wishcard/detail', data);
	} catch (error) {
		next(error);
	}
});

router.get('/donate/:id', Permissions.redirectLogin, (_req, res, _next) => {
	return res.render('pages/wishcard/donate');
});

// ------------- only agencies and admins from here on -------------

router.get('/edit/:id', Permissions.isAdminOrAgency, (_req, res, _next) => {
	return res.render('pages/wishcard/edit');
});

router.get('/manage', Permissions.isAdminOrAgency, (_req, res, _next) => {
	return res.render('pages/wishcard/manage');
});

router.get('/create', Permissions.isAdminOrAgency, (_req, res, _next) => {
	return res.render('pages/wishcard/create');
});

export default router;
