/* eslint-disable no-case-declarations */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const moment = require('moment');
const paypal = require('paypal-rest-sdk');
const { handleError } = require('../helper/error');
const { redirectLogin } = require('./middleware/login.middleware');
const WishCardRepository = require('../db/repository/WishCardRepository');
const UserRepository = require('../db/repository/UserRepository');
// const DonationRepository = require('../db/repository/DonationRepository');
// const { sendDonationConfirmationMail } = require('../helper/messaging');
const log = require('../helper/logger');
const { sendDonationNotificationToSlack } = require('../helper/messaging');
const { calculateWishItemTotalPrice } = require('../helper/wishCard.helper');


paypal.configure({
  'mode': process.env.NODE_ENV === 'development'?'sandbox':'live', // sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_SECRET
});

const router = express.Router();

// const endpointSecret = process.env.STRIPE_SECRET;

router.post('/createIntent', redirectLogin, async (req, res) => {
  const { wishCardId, email, agencyName, userDonation } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const wishCard = await WishCardRepository.getWishCardByObjectId(mongoSanitize.sanitize(wishCardId));

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

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {


  if (req.body.event_type === 'CHECKOUT.ORDER.APPROVED') {

    paypal.notification.webhookEvent.getAndVerify(req.rawBody, async (error, response) => {
      if (error) {
        log.info(error);
        throw error;
      } else {

        log.info(response);

        const data = req.body.resource.purchase_units[0].reference_id.split('%');
        const userId = data[0];
        const wishCardId = data[1];
        const userDonation = data[2];
        const amount = req.body.resource.purchase_units[0].amount.value;

        log.info(data)
        log.info(userId)
        log.info(wishCardId)
        log.info(userDonation)
        log.info(amount)

        const user = await UserRepository.getUserByObjectId(userId);
        const wishCard = await WishCardRepository.getWishCardByObjectId(wishCardId);

        await sendDonationNotificationToSlack('PayPal', userDonation, user, wishCard, amount);


      }
    });
  }


  /*
  const user = await UserRepository.getUserByObjectId(event.data.object.metadata.userId);
  const wishCard = await WishCardRepository.getWishCardByObjectId(event.data.object.metadata.wishCardId);

  if (user) {
    const emailResponse = await sendDonationConfirmationMail({
      email: user.email,
      firstName: user.fName,
      lastName: user.lName,
      childName: wishCard.childFirstName,
      item: wishCard.wishItemName,
      price: wishCard.wishItemPrice,
      agency: event.data.object.metadata.agencyName,
    });

    const response = emailResponse ? emailResponse.data : '';
    if (process.env.NODE_ENV === 'development') {
      log.info(response);
    }
  }

  await DonationRepository.createNewDonation({
    donationFrom: user._id,
    donationTo: wishCard.belongsTo,
    donationCard: wishCard._id,
    donationPrice: event.data.object.amount / 100,
  });

  wishCard.status = 'donated';
  wishCard.save();

  log.info('Wishcard donated', { type: 'wishcard_donated',
    user: user._id,
    wishCardId: wishCard._id,
    amount: event.data.object.amount / 100,
    agency: event.data.object.metadata.agencyName});

  await sendDonationNotificationToSlack(user, wishCard, event.data.object.amount / 100);

  */
  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
});

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get('/payment/success/:id&:totalAmount', redirectLogin, async (req, res) => {
  try {
    const { id, totalAmount } = req.params;
    const wishCard = await WishCardRepository.getWishCardByObjectId(mongoSanitize.sanitize(id));
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
