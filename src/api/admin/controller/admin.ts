import { NextFunction, Request, Response } from 'express';

import WishCardRepository from '../../../db/repository/WishCardRepository';
import BaseController from '../../controller/basecontroller';

export default class AdminController extends BaseController {
	private wishCardRepository: WishCardRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
	}

	handleGetDraftWishcards = async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const wishcards = await this.wishCardRepository.getWishCardsByStatus('draft');
			const agenciesWithWishCardsMap: Map<string, any[]> = new Map();

			for (const wishCard of wishcards) {
				const agencyName = wishCard.belongsTo.agencyName;
				if (!agenciesWithWishCardsMap.has(agencyName)) {
					agenciesWithWishCardsMap.set(agencyName, []);
				}
				agenciesWithWishCardsMap.get(agencyName)?.push(wishCard);
			}
			const agenciesWithWishCards = Object.fromEntries(agenciesWithWishCardsMap);
			return res.status(200).send({ success: true, data: agenciesWithWishCards });
		} catch (error) {
			return res.status(200).send({ success: false, data: 'agenciesWithWishCards' });
		}
	};

	handlePutDraftWishcard = async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const { wishCardId, wishItemUrl } = req.body;
			console.log('IN AWESOME API ONTROLOER');
			console.log(wishCardId, wishItemUrl);
			const wishCardModifiedFields = {
				wishItemUrl,
				status: 'published',
			};

			await this.wishCardRepository.updateWishCardByObjectId(
				wishCardId,
				wishCardModifiedFields,
			);

			// @TODO: add agency notification email sending here after status was updated
			return res.status(200).send({
				success: true,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	};
}
