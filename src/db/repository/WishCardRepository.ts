import moment from 'moment';
import { Types } from 'mongoose';

import config from '../../helper/config';
import Messaging from '../../helper/messaging';
import Agency from '../models/Agency';
import { STATUS } from '../models/WishCard';
import WishCard from '../models/WishCard';

import DonationRepository from './DonationRepository';
import UserRepository from './UserRepository';
export default class WishCardRepository {
	private wishCardModel: typeof WishCard;

	private wishCardChangeListener: any;

	private userRepository: UserRepository;

	private donationRepository: DonationRepository;

	constructor() {
		this.wishCardModel = WishCard;

		this.userRepository = new UserRepository();

		this.donationRepository = new DonationRepository();

		if (!this.wishCardChangeListener && config.NODE_ENV === 'production') {
			this.wishCardChangeListener = this.wishCardModel.watch();
		}
	}

	async createNewWishCard(wishCardParams: WishCard) {
		try {
			return await this.wishCardModel.create(wishCardParams);
		} catch (error) {
			throw new Error(`Failed to create new WishCard: ${error}`);
		}
	}

	async getAll() {
		const publisehd = await this.wishCardModel //NOTE: there is a typo here @Enubia
			.aggregate<WishCard>([{ $match: { status: 'published' } }])
			.exec();

		const donated = await this.wishCardModel
			.aggregate<WishCard>([{ $match: { status: 'donated' } }])
			.exec();
		return [...publisehd, ...donated];
	}

	async getCurated() {
		const donated = await this.wishCardModel
			.aggregate<WishCard>([{ $match: { status: 'donated' } }])
			.exec();

		const selectedWishcardIds = [
			'5f80d422a99508e349bb87ea',
			'5f7f8a8eb09ed5121216bd1b',
			'5fc48548495483e2e4e87432',
			'5f90a7fc987faa6593d8c061',
			'5fd18775e7553d5923e6ce63',
			'5fd188fee7553d5923e6ce64',
			'5f9b3373987faa6593d8c07a',
			'5fc486a5495483e2e4e87433',
			'5f847114a99508e349bb87fd',
		];
		const curated: WishCard[] = [];
		[...donated].forEach((card: WishCard) => {
			if (selectedWishcardIds.includes(`${card._id}`)) {
				curated.push(card);
			}
		});

		return curated;
	}

	async getRandom(status: STATUS, sampleSize: number) {
		const result = await this.wishCardModel
			.aggregate<WishCard>([{ $match: { status } }, { $sample: { size: sampleSize } }])
			.exec();

		if (result.length < sampleSize) {
			const donated = await this.wishCardModel
				.aggregate<WishCard>([
					{ $match: { status: 'donated' } },
					{ $sample: { size: sampleSize - result.length } },
				])
				.exec();
			return [...result, ...donated];
		}

		return result;
	}

	async getViewableWishCards(showDonated: boolean) {
		try {
			const searchArray = [{ status: 'published' }];

			if (showDonated) {
				searchArray.push({ status: 'donated' });
			}

			return await this.wishCardModel.find({ $or: searchArray }).limit(25).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardsByItemName(itemName: string, status: STATUS) {
		try {
			return await this.wishCardModel
				.find({
					wishItemName: { $regex: itemName, $options: 'i' },
					status,
				})
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get WishCards: ${error}`);
		}
	}

	async getWishCardsFuzzy(
		itemName: string,
		showDonated: boolean,
		reverseSort: boolean,
		priceSortOrder: string | null,
		cardIds?: string[],
	) {
		try {
			const searchMatch: Record<string, unknown>[] = [];
			const statusMatch = [{ status: 'published' }];

			if (showDonated) {
				statusMatch.push({ status: 'donated' });
			}

			let ids: Types.ObjectId[] = [];

			if (itemName) {
				searchMatch.push(
					{ wishItemName: { $regex: itemName, $options: 'i' } },
					{ childStory: { $regex: itemName, $options: 'i' } },
					{ childInterest: { $regex: itemName, $options: 'i' } },
					{ childFirstName: { $regex: itemName, $options: 'i' } },
					{ childLastName: { $regex: itemName, $options: 'i' } },
				);
			}

			if (cardIds) {
				ids = cardIds.map((id: string) => new Types.ObjectId(id));
			}

			let sortOrder = 1;
			if (reverseSort) {
				sortOrder = -1;
			}

			const sortAttributes = {
				...(priceSortOrder != null && { wishItemPrice: parseInt(priceSortOrder) }),
				status: -1,
				createdAt: sortOrder,
			};

			const matchPipeline: Record<string, unknown>[] = [
				{
					$match: {
						_id: { $nin: ids },
						$or: statusMatch,
					},
				},
				{
					$sort: sortAttributes,
				},
			];

			if (itemName) {
				matchPipeline.unshift({
					$match: {
						_id: { $nin: ids },
						$or: searchMatch,
					},
				});
			}

			return await this.wishCardModel.aggregate(matchPipeline as any).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards fuzzy: ${error}`);
		}
	}

	async getWishCardById(cardId: string) {
		try {
			return await this.wishCardModel.findOne({ _id: cardId }).populate('belongsTo').exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getWishCardsByStatus(status: STATUS) {
		try {
			return await this.wishCardModel
				.find({ status })
				.populate<{ belongsTo: Agency }>('belongsTo')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getLockedWishcardsByUserId(userId: string) {
		try {
			return await this.wishCardModel.findOne({ isLockedBy: userId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async updateWishCardByObjectId(id: string, updateParams: Partial<WishCard>) {
		try {
			return await this.wishCardModel
				.findOneAndUpdate({ _id: id }, { $set: updateParams }, { new: true })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async deleteWishCard(wishCardId: string) {
		try {
			return await this.wishCardModel.deleteOne({ _id: wishCardId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to delete Wishcard message: ${error}`);
		}
	}

	async getWishCardByAgencyId(agencyId: string) {
		try {
			return await this.wishCardModel.find({ belongsTo: agencyId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Wishcards: ${error}`);
		}
	}

	async getWishCardByObjectId(cardId: string) {
		try {
			return await WishCard.findOne({ _id: cardId })
				.populate<{ belongsTo: Agency }>('belongsTo')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	private hasWishcardStatusChangedTo(change: Record<string, any>, status: any) {
		return (
			change &&
			change.operationType === 'update' &&
			change.updateDescription?.updatedFields?.status === status
		);
	}

	private wishCardIsOrdered(change: Record<string, any>) {
		return this.hasWishcardStatusChangedTo(change, 'ordered');
	}

	private wishCardIsPublished(change: Record<string, any>) {
		return this.hasWishcardStatusChangedTo(change, 'published');
	}

	private async handleDonationOrdered(change) {
		const wishCard = await this.getWishCardByObjectId(change.documentKey._id);

		if (wishCard) {
			const agency = wishCard.belongsTo;
			const accountManager = await this.userRepository.getUserByObjectId(
				agency.accountManager,
			);

			const donation = await this.donationRepository.getDonationByWishCardId(
				String(wishCard._id),
			);

			await this.donationRepository.updateDonationStatus(String(donation?._id), 'ordered');
			await Messaging.sendAgencyDonationEmail({
				agencyEmail: accountManager?.email,
				agencyName: agency.agencyName,
				childName: wishCard.childFirstName,
				item: wishCard.wishItemName,
				price: wishCard.wishItemPrice,
				donationDate: moment(new Date(donation!.donationDate)).format('MMM Do, YYYY'),
				address: `${agency.agencyAddress.address1} ${agency.agencyAddress.city} ${agency.agencyAddress.zipcode} ${agency.agencyAddress.state}`,
			});
		}
	}

	private async handleWishcardPublished(change) {
		const wishCard = await this.getWishCardByObjectId(change.documentKey._id);

		if (wishCard) {
			const agency = wishCard.belongsTo;
			const accountManager = await this.userRepository.getUserByObjectId(
				agency.accountManager,
			);
			await Messaging.sendWishPublishedEmail({
				agencyEmail: accountManager?.email,
				childName: wishCard.childFirstName,
				wishCardId: wishCard._id,
			});
		}
	}

	watch() {
		this.wishCardChangeListener.on('change', async (change: Record<string, any>) => {
			if (this.wishCardIsOrdered(change)) {
				await this.handleDonationOrdered(change);
			} else if (this.wishCardIsPublished(change)) {
				await this.handleWishcardPublished(change);
			}
		});
	}
}
