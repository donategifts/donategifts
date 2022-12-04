const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../../config/config.env') });
require('../connection').connect();

const log = require('../../helper/logger');

const UserRepository = require('../repository/UserRepository');
const WishCardRepository = require('../repository/WishCardRepository');
const AgencyRepository = require('../repository/AgencyRepository');

async function addBelongsTo() {
	const wishcards = await WishCardRepository.getAllWishCards();

	wishcards.forEach(async (wishcard) => {
		if (!wishcard.status || wishcard.status === 'draft') {
			// eslint-disable-next-line no-param-reassign
			wishcard.status = 'published';
			wishcard.save();
		}

		if (wishcard.createdBy) {
			const user = await UserRepository.getUserByObjectId(wishcard.createdBy);

			if (user) {
				const agency = await AgencyRepository.getAgencyByUserId(user._id);
				if (agency) {
					// eslint-disable-next-line no-param-reassign
					wishcard.belongsTo = agency._id;
					wishcard.save();
					log.info(`BelongsTo stored for wishcard: ${wishcard._id}`);
				} else {
					log.error(
						`Wishcard: ${wishcard._id} has no valid AgencyUser in createdBy field!`,
					);
				}
			} else {
				log.error(`Wishcard: ${wishcard._id} has no valid User in createdBy field!`);
			}
		} else {
			log.error(`Wishcard: ${wishcard._id} has no createdBy field!`);
		}
	});
}

addBelongsTo().catch(log.error);
