const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const mongoSanitize = require('express-mongo-sanitize');
const { handleError } = require('../helper/error');
const { redirectLogin } = require('./middleware/login.middleware');
const WishCardRepository = require('../db/repository/WishCardRepository');
const { sendDonationConfirmationMail } = require('../helper/messaging');
const log = require('../helper/logger');
const { calculateWishItemTotalPrice } = require('../helper/wishCard.helper');

const router = express.Router();

router.post('/createIntent', redirectLogin, async (req, res) => {
  const { wishCardId } = req.body;

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
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    handleError(res, 400, 'Wishcard not found');
  }
});

router.post('/confirmation', redirectLogin, async (req, res) => {
  const { email, firstName, lastName, childName, item, price, agency } = req.body;

  try {
    const emailResponse = await sendDonationConfirmationMail({
      email,
      firstName,
      lastName,
      childName,
      item,
      price,
      agency,
    });
    const response = emailResponse ? emailResponse.data : '';
    if (process.env.NODE_ENV === 'development') {
      log.info(response);
    }

    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    handleError(res, 400, 'Failed to send receipt email!');
  }
});

module.exports = router;
