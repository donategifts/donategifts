/* eslint-disable no-case-declarations */
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const { handleError } = require('../helper/error');
const { redirectLogin } = require('./middleware/login.middleware');
const WishCardRepository = require('../db/repository/WishCardRepository');
const UserRepository = require('../db/repository/UserRepository');
const { sendDonationConfirmationMail } = require('../helper/messaging');
const log = require('../helper/logger');
const { sendDonationNotificationToSlack } = require('../helper/messaging');
const { calculateWishItemTotalPrice } = require('../helper/wishCard.helper');

const router = express.Router();

const endpointSecret = process.env.STRIPE_SECRET;

router.post('/createIntent', redirectLogin, async (req, res) => {
  const { wishCardId, email, agencyName } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const wishCard = await WishCardRepository.getWishCardByObjectId(mongoSanitize.sanitize(wishCardId));

  // By default stripe accepts "pennies" and we are storing in a full "dollars". 1$ == 100
  // so we need to multiple our price by 100. Genious explanation
  const PENNY = 100;
  const totalItemPrice = await calculateWishItemTotalPrice(wishCard.wishItemPrice);
  if (wishCard) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalItemPrice * PENNY,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        wishCardId: wishCard._id.toString(),
        userId: res.locals.user._id.toString(),
        agencyName,
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
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      try {
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

        await sendDonationNotificationToSlack(user, wishCard, event.data.object.amount);
        break;
      } catch (error) {
        log.debug(error);
        break;
      }
    default:
      break;
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
