import { DonationRepository } from '@donategifts/donation';
import { WishCardRepository } from '@donategifts/wishcard';
import { UserRepository } from '@donategifts/user-data';
import {
	sendDonationNotificationToSlack,
	sendDonationConfirmationMail,
	IDonationSlack,
	IDonationConfirmationEmail,
	logger,
} from '@donategifts/helper';
import { IDonationHook, IUser, ObjectId, IWishCard } from '@donategifts/common';

async function calculateWishItemTotalPrice(itemPrice: number): Promise<number> {
	// fee for processing item. 3% charged by stripe for processing each card trasaction + 5% from us to cover the possible item price change difference
	const PROCESSING_FEE = 1.08;
	// Open for discussion. Each state has its own tax so maybe create values for each individual(key-value) or use a defined one for everything since we are
	// doing all the shopping
	const TAX = 1.0712;
	const processingItemFee = itemPrice * PROCESSING_FEE - itemPrice;
	const itemTax = itemPrice * TAX - itemPrice;
	const totalPrice = itemPrice + itemTax + processingItemFee;
	const roundTotalPrice: number = parseFloat(totalPrice.toPrecision(2));
	return roundTotalPrice;
}

const handleDonation = async (donation: IDonationHook): Promise<boolean> => {
	const { service, userId, wishCardId, amount, userDonation, agencyName } = donation;
	const user = await UserRepository.getUserById(ObjectId<IUser>(userId));
	const wishCard = await WishCardRepository.getWishCardByObjectId(ObjectId<IWishCard>(wishCardId));

	if (user) {
		const newEmail: IDonationConfirmationEmail = {
			email: user.email,
			firstName: user.fName,
			lastName: user.lName,
			childName: wishCard.childFirstName,
			item: wishCard.wishItemName,
			price: wishCard.wishItemPrice,
			agency: agencyName,
		};

		const emailResponse = await sendDonationConfirmationMail(newEmail);

		const response = emailResponse ? emailResponse.data : '';
		if (process.env.NODE_ENV === 'development') {
			logger.info(response);
		}

		await DonationRepository.createNewDonation({
			donationFrom: user._id,
			donationTo: wishCard.belongsTo,
			donationCard: wishCard._id,
			donationPrice: amount,
		});

		await WishCardRepository.updateWishCardStatus(wishCard._id, 'donated');

		logger.info('Wishcard donated', {
			type: 'wishcard_donated',
			user: user._id,
			wishCardId: wishCard._id,
			amount,
			agency: agencyName,
		});

		const donationInfo: IDonationSlack = {
			service,
			userDonation,
			donor: user,
			wishCard,
			amount,
		};
		return sendDonationNotificationToSlack(donationInfo);
	}
	return false;
};

export { calculateWishItemTotalPrice, handleDonation };
