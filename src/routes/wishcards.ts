import express from 'express';
import { Selectable } from 'kysely';

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

router.get('/', (_req, res, _next) => res.render('pages/wishcards'));

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

        const wishcard = await WishcardsRepository.getById(wishcardId);
        if (wishcard.image_id) {
            childImage = await ImagesRepository.getById(wishcard.image_id);
        }
        const child = await ChildrenRepository.getById(wishcard.child_id);
        const item = await ItemsRepository.getById(wishcard.item_id);

        let itemImage: Selectable<Images> | null = null;

        if (item.image_id) {
            itemImage = await ImagesRepository.getById(item.image_id);
        }

        const result = (await MessagesRepository.getByWishCardId(
            wishcardId,
        )) as Selectable<Messages>[];

        for (const message of result) {
            if (!message.sender_id) {
                continue;
            }

            const poster = await UsersRepository.getById(message.sender_id);

            messages.push({
                sender: poster,
                message,
            });
        }

        const agency = await AgenciesRepository.getByAccountManagerId(wishcard.created_by);

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

router.get('/donate/:id', Permissions.redirectLogin, (_req, res, _next) => res.render('pages/wishcard/donate'));

// ------------- only agencies and admins from here on -------------

router.get('/edit/:id', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/edit'));

router.get('/manage', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/manage'));

router.get('/create', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/create'));

export default router;
