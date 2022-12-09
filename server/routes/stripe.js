/* eslint-disable no-case-declarations */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const bodyParser = require('body-parser');
const moment = require('moment');
const paypal = require('paypal-rest-sdk');
const { handleError } = require('../helper/error');
const { redirectLogin } = require('./middleware/login.middleware');
const WishCardRepository = require('../db/repository/WishCardRepository');
const UserRepository = require('../db/repository/UserRepository');
const DonationRepository = require('../db/repository/DonationRepository');
const {
  sendDonationConfirmationMail,
  sendDiscordDonationNotification,
} = require('../helper/messaging');
const log = require('../helper/logger');
const { calculateWishItemTotalPrice } = require('../helper/wishCard.helper');

paypal.configure({
	mode: process.env.NODE_ENV === 'development' ? 'sandbox' : 'live', // sandbox or live
	client_id: process.env.PAYPAL_CLIENT_ID,
	client_secret: process.env.PAYPAL_SECRET,
});

const handleDonation = async (service, userId, wishCardId, amount, userDonation, agencyName) => {
  const user = await UserRepository.getUserByObjectId(userId);
  const wishCard = await WishCardRepository.getWishCardByObjectId(wishCardId);

  if (user) {
    const emailResponse = await sendDonationConfirmationMail({
      email: user.email,
      firstName: user.fName,
      lastName: user.lName,
      childName: wishCard.childFirstName,
      item: wishCard.wishItemName,
      price: wishCard.wishItemPrice,
      agency: agencyName,
    });

    const response = emailResponse ? emailResponse.data : '';
    if (process.env.NODE_ENV === 'development') {
      log.info(response);
    }

    await DonationRepository.createNewDonation({
      donationFrom: user._id,
      donationTo: wishCard.belongsTo,
      donationCard: wishCard._id,
      donationPrice: amount,
    });

    wishCard.status = 'donated';
    wishCard.save();

    await sendDiscordDonationNotification({
      user: user.fName,
      service,
      wishCard: {
        item: wishCard.wishItemName,
        url: wishCard.wishItemURL,
        child: wishCard.childFirstName,
      },
      donation: {
        amount,
        userDonation,
      },
    });
  }
};

const router = express.Router();

// const endpointSecret = process.env.STRIPE_SECRET;

router.post('/createIntent', redirectLogin, async (req, res) => {
	const { wishCardId, email, agencyName, userDonation } = req.body;
	// Create a PaymentIntent with the order amount and currency
	const wishCard = await WishCardRepository.getWishCardByObjectId(wishCardId);

	// By default stripe accepts "pennies" and we are storing in a full "dollars". 1$ == 100
	// so we need to multiple our price by 100. Genious explanation
	const PENNY = 100;
	let totalItemPrice = parseFloat(await calculateWishItemTotalPrice(wishCard.wishItemPrice));
	if (userDonation) totalItemPrice += parseFloat(userDonation);
	if (wishCard) {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.floor(totalItemPrice * PENNY),
			currency: 'usd',
			receipt_email: email,
			metadata: {
				wishCardId: wishCard._id.toString(),
				userId: res.locals.user._id.toString(),
				agencyName,
				userDonation,
			},
		});

		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	} else {
		handleError(res, 400, 'Wishcard not found');
	}
});

let lastWishcardDonation = '';

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
	const sig = req.headers['stripe-signature'];

	// STRIPE WEBHOOK
	if (sig) {
		const endpointSecret = process.env.STRIPE_SECRET;
		let event;

		try {
			event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

			if (lastWishcardDonation !== event.data.object.metadata.wishCardId) {
				lastWishcardDonation = event.data.object.metadata.wishCardId;

				await handleDonation(
					'Stripe',
					event.data.object.metadata.userId,
					event.data.object.metadata.wishCardId,
					event.data.object.amount / 100,
					event.data.object.metadata.userDonation,
					event.data.object.metadata.agencyName,
				);
			}
		} catch (err) {
			res.status(400).send(`Webhook Error: ${err.message}`);
		}
	}

	// PAYPAL WEBHOOK
	if (req.body.event_type === 'CHECKOUT.ORDER.APPROVED') {
		paypal.notification.webhookEvent.getAndVerify(req.rawBody, async (error, response) => {
			if (error) {
				log.info(error);
				throw error;
			} else {
				// needed to shut up lint
				log.info(response);

				const data = req.body.resource.purchase_units[0].reference_id.split('%');
				const userId = data[0];
				const wishCardId = data[1];
				const userDonation = data[2];
				const agencyName = data[3];
				const amount = req.body.resource.purchase_units[0].amount.value;

				await handleDonation(
					'Paypal',
					userId,
					wishCardId,
					amount,
					userDonation,
					agencyName,
				);
			}
		});
	}

	/*

  */
	// Return a res to acknowledge receipt of the event
	res.json({ received: true });
});

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get('/payment/success/:id&:totalAmount', redirectLogin, async (req, res) => {
	try {
		const { id, totalAmount } = req.params;
		const wishCard = await WishCardRepository.getWishCardByObjectId(id);
		const currentDate = moment(Date.now());
		const donationInformation = {
			email: res.locals.user.email,
			totalAmount,
			orderDate: currentDate.format('MMM D YYYY'),
			itemName: wishCard.wishItemName,
			childName: wishCard.childFirstName,
		};
		res.status(200).render('successPayment', {
			user: res.locals.user,
			donationInformation,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

module.exports = router;
