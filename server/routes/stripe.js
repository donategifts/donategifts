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

const router = express.Router();

const endpointSecret = process.env.STRIPE_SECRET;

router.post('/createIntent', redirectLogin, async (req, res) => {
  const { wishCardId, email, agencyName } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const wishCard = await WishCardRepository.getWishCardByObjectId(mongoSanitize.sanitize(wishCardId));

  if (wishCard) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: wishCard.wishItemPrice * 100,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        wishCardId: wishCard._id,
        userId: res.locals.user._id,
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
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
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

      await sendDonationNotificationToSlack(user, wishCard);
      break;
    default:
      break;
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
});

module.exports = router;
