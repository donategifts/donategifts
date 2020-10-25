/*
serving all wishcard related routes
'/wishcards' is already mounted, so no need to start with it for each route.
/search/:keyword    /get/:id    /get/all    /get/random     /update/:id
*/

// NPM DEPENDENCIES
const express = require('express');

const router = express.Router();
const moment = require('moment');
const rateLimit = require('express-rate-limit');
const io = require('../helper/socket');
const scrapeList = require('../../scripts/amazon-scraper')
const {
  createWishcardValidationRules,
  createGuidedWishcardValidationRules,
  searchValidationRules,
  getByIdValidationRules,
  updateWishCardValidationRules,
  postMessageValidationRules,
  getDefaultCardsValidationRules,
  lockWishCardValidationRules,
  validate,
} = require('./validations/wishcards.validations');

const { redirectLogin } = require('../helper/userHelper');
const { renderPermissions } = require('../helper/wishcardHelper');

const {
  babies,
  preschoolers,
  kids6_8,
  kids9_11,
  teens,
  youth,
  allAgesA,
  allAgesB,
} = require('../utils/defaultItems');
const { handleError } = require('../helper/error');
const WishCardController = require('../controller/wishCard.controller');
const { getMessageChoices } = require('../utils/defaultMessages');

// IMPORT REPOSITORIES
const UserRepository = require('../db/repository/UserRepository');
const MessageRepository = require('../db/repository/MessageRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');
const DonationsRepository = require('../db/repository/DonationRepository');

// allow only 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

// @desc    wishcard creation form sends data to db
// @route   POST '/wishcards'
// @access  Private, verified partner
// @tested 	Yes
router.post(
  '/',
  limiter,
  renderPermissions,
  WishCardController.upload.single('wishCardImage'),
  createWishcardValidationRules(),
  validate,
  async (req, res) => {
    if (req.file === undefined) {
      handleError(
        res,
        400,
        'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
      );
    } else {
      try {
        const { childBirthday, wishItemPrice } = req.body;

        let filePath = req.file.location;

        if (process.env.NODE_ENV === 'development') {
          filePath = req.file.path.slice(req.file.path.indexOf('/uploads'), req.file.path.length);
        }

        const newWishCard = await WishCardRepository.createNewWishCard({
          childBirthday: new Date(childBirthday),
          wishItemPrice: Number(wishItemPrice),
          wishCardImage: filePath,
          createdBy: res.locals.user._id,
          // Uncomment once address fields are added to profile page.
          // address: {
          //   address1: req.body.address1,
          //   address2: req.body.address2,
          //   city: req.body.address_city,
          //   state: req.body.address_state,
          //   zip: req.body.address_zip,
          //   country: req.body.address_country,
          // },
          ...req.body,
        });
        const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
        await AgencyRepository.pushNewWishCardToAgency(userAgency._id, newWishCard);
        res.status(200).send({ success: true, url: '/wishcards/' });
      } catch (error) {
        handleError(res, 400, error);
      }
    }
  },
);

// @desc    wishcard creation form (guided process, i.e. uses default toy choices) sends data to db
// @route   POST '/wishcards/guided/'
// @access  Private, verified partners
// @tested 	Yes
router.post(
  '/guided/',
  limiter,
  renderPermissions,
  WishCardController.upload.single('wishCardImage'),
  createGuidedWishcardValidationRules(),
  validate,
  async (req, res) => {
    if (req.file === undefined) {
      handleError(
        res,
        400,
        `Error: File must be in jpeg, jpg, gif, or png format. The file
        mst also be less than 5 megabytes.`,
      );
    } else {
      try {
        const {
          childBirthday,
          address1,
          address2,
          address_city,
          address_state,
          address_zip,
          address_country,
        } = req.body;
        let { itemChoice } = req.body;

        let filePath = req.file.location;

        if (process.env.NODE_ENV === 'development') {
          filePath = req.file.path.slice(req.file.path.indexOf('/uploads'), req.file.path.length);
        }

        itemChoice = JSON.parse(itemChoice);
        await WishCardRepository.createNewWishCard({
          childBirthday: new Date(childBirthday),
          wishItemName: itemChoice.Name,
          wishItemPrice: Number(itemChoice.Price),
          wishItemURL: itemChoice.ItemURL,
          wishCardImage: filePath,
          createdBy: res.locals.user._id,
          address: {
            address1,
            address2,
            city: address_city,
            state: address_state,
            zip: address_zip,
            country: address_country,
          },
          ...req.body,
        });

        res.status(200).send({ success: true, url: '/wishcards/' });
      } catch (error) {
        handleError(res, 400, error);
      }
    }
  },
);

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards'
// @access  Public
// @tested 	Yes
router.get('/', async (_req, res) => {
  try {
    const wishcards = await WishCardRepository.getAllWishCards();

    for (let i = 0; i < wishcards.length; i++) {
      const birthday = moment(new Date(wishcards[i].childBirthday));
      const today = moment(new Date());

      wishcards[i].age = today.diff(birthday, 'years');
    }

    res.status(200).render('wishCards', {
      user: res.locals.user,
      wishcards,
      socketUrl: process.env.SOCKET_URL,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

// @desc    Retrun wishards that belong to the agency
// @route   POST '/wishcards/me'
// @access  Agency
// @tested 	No
router.get('/me', async (req, res) => {
  try {
    const { filter } = req.query;
    const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
    const agencyInfo = await AgencyRepository.getAgencyWishCards(userAgency._id);
    // if filter param is present, filter wishcards based on it
    const filteredWishCards =
      filter !== undefined
        ? agencyInfo.wishCards.filter((wishcard) => wishcard.status === filter)
        : agencyInfo.wishCards;
    res.status(200).send({
      success: true,
      error: null,
      data: filteredWishCards,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

// @desc    search the wish cards by substring of wishItemName
// @route   POST '/wishcards/search'
// @access  Public
// @tested 	Yes
router.post('/search', searchValidationRules(), validate, async (req, res) => {
  try {
    const results = await WishCardRepository.getWishCardsByItemName(req.body.wishitem);
    res.status(200).render('wishCards', {
      user: res.locals.user,
      wishcards: results,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

const getPreviousMessages = async (wishcard) => {
  let messages = [];
  if (wishcard.messages.length > 0) {
    messages = await Promise.all(
      wishcard.messages.map(async (messageID) => {
        const foundMessage = await MessageRepository.getMessageByObjectId(messageID);
        const foundUser = await UserRepository.getUserByObjectId(foundMessage.messageFrom);
        return {
          message: foundMessage.message,
          fromUser: foundUser.fName,
        };
      }),
    );
  }
  return messages;
};

// @desc    Retrieve one wishcard by its _id
// @route   GET '/wishcards/:id'
// @access  Private, all users (path led by "see more" button). See more btn is however is public.
// @tested 	Yes
router.get('/:id', redirectLogin, getByIdValidationRules(), validate, async (req, res) => {
  try {
    const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);

    const birthday = moment(new Date(wishcard.childBirthday));
    const today = moment(new Date());

    wishcard.age = today.diff(birthday, 'years');

    const messages = await getPreviousMessages(wishcard);
    const defaultMessages = getMessageChoices(res.locals.user.fName, wishcard.childFirstName);
    // create a page and have a dynamic link for see more
    res.status(200).render('wishCardFullPage', {
      user: res.locals.user,
      wishcard: wishcard || [],
      messages,
      defaultMessages,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

// @desc    display 3 wishcards randomly in the sample wishcard section of index.html
// @route   GET '/wishcards/get/random'
// @access  Public
// @tested 	No
router.get('/get/random', async (req, res) => {
  try {
    let wishcards = await WishCardRepository.getAllWishCards();
    if (!wishcards) {
      wishcards = [];
    } else {
      wishcards.sort(() => Math.random() - 0.5); // [wishcard object, wishcard object, wishcard object]
      wishcards = wishcards.slice(0, 3);
    }
    res.render('templates/homeSampleCards', { wishcards }, (error, html) => {
      if (error) {
        res.status(400).json({ success: false, error });
      } else {
        res.status(200).send(html);
      }
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

// @desc    update one wishcard by id
// @route   PUT '/wishcards/update/:id'
// @access  Private, only for verified partners
// @tested 	Not yet
router.put(
  '/update/:id',
  renderPermissions,
  updateWishCardValidationRules(),
  validate,
  async (req, res) => {
    // what are we doing here?
    try {
      const result = await WishCardRepository.getWishCardByObjectId(req.params.id);
      // WHERE ARE WE EDITING THIS ON THE FRONT END?
      //     - in /users/profile
      //     - all wishcards created by this user should display
      //     - then add a pencil icon for edit function
      result.save();
    } catch (error) {
      handleError(res, 400, error);
    }
  },
);

// @desc    User can post a message to the wishcard
// @route   POST '/wishcards/message'
// @access  Private, all users
// @tested  Yes
router.post(
  '/message',
  renderPermissions,
  postMessageValidationRules(),
  validate,
  async (req, res) => {
    try {
      const { messageFrom, messageTo, message } = req.body;
      const newMessage = await MessageRepository.createNewMessage({
        messageFrom,
        messageTo,
        message,
      });

      await WishCardRepository.pushNewWishCardMessage(messageTo._id, newMessage);

      res.status(200).send({
        success: true,
        error: null,
        data: newMessage,
      });
    } catch (error) {
      handleError(res, 400, error);
    }
  },
);

const checkIfItemIsDonated = (async (wishlist) => {

  const wishListArray = /registryID\.1=(.*?)&.*?registryItemID.1=(.*?)&/gm.exec(wishlist.wishItemURL);
  const wishListId = wishListArray[1];
  const itemId = wishListArray[2];

  if (wishListId) {
    const scrapeResponse = await scrapeList(`https://www.amazon.com/hz/wishlist/ls/${wishListId}` );

    console.log(scrapeResponse);

    if (!scrapeResponse) return false;

    if (Object.keys(scrapeResponse).length > 0) {
      return !JSON.stringify(scrapeResponse).includes(itemId);
    }
    return true
  }
})

// @desc   lock a wishcard
// @route  POST '/wishcards/message'
// @access  Public, all users
// @tested 	Not yet
const blockedWishcardsTimer = [];

router.post('/lock/:id', lockWishCardValidationRules, validate, async (req, res) => {
  try {

    const wishCardId = req.params.id;

    if (!req.session.user) return handleError(res, 400, 'User not found');

    const user = await UserRepository.getUserByObjectId(req.session.user._id);
    if (!user) return handleError(res, 400, 'User not found');

    // check if user already has a locked wishcard
    const wishcardAlreadyLockedByUser = await WishCardRepository.getLockedWishcardsByUserId(req.session.user._id);

    if(wishcardAlreadyLockedByUser) {
      // user has locked wishcard and its still locked
      if (moment(wishcardAlreadyLockedByUser.isLockedUntil) >= moment()) {
        return handleError(res, 400, 'You already have a locked wishcard.');
      }
    }

    // check if wishcard is locked by someone else
    const wishCard = await WishCardRepository.getWishCardByObjectId(wishCardId);

    if (moment(wishCard.isLockedUntil) > moment()) {
      return handleError(res, 400, 'Wishcard has been locked by someone else.');
    }

    const lockedWishCard = await WishCardRepository.lockWishCard(wishCardId, user._id);

    io.emit('block', {id: wishCardId, lockedUntil: lockedWishCard.isLockedUntil});

    blockedWishcardsTimer[wishCardId] = setTimeout(async () => {
      const isDonated = await checkIfItemIsDonated(wishCard);

      if(isDonated) {
        wishCard.isDonated = true;
        wishCard.save();

        await DonationsRepository.createNewDonation({
          donationTo: wishCardId,
          donationFrom: user._id,
          donationPrice: wishCard.wishItemPrice,
          donationConfirmed: true
        });

        io.emit('donated', {id: wishCardId, donatedBy: user._id});
      }
    }, 10000)

    res.status(200).send({
      success: true,
      error: null,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});


router.post('/unlock/:id', async (req, res) => {
  try {

    const wishCardId = req.params.id;

    if (!req.session.user) return handleError(res, 400, 'User not found');

    const user = await UserRepository.getUserByObjectId(req.session.user._id);
    if (!user) return handleError(res, 400, 'User not found');

    const lockedWishcard = await WishCardRepository.getLockedWishcardsByUserId(req.session.user._id);
    if(lockedWishcard && lockedWishcard.isLockedBy === req.session.user._id) {

      await WishCardRepository.unLockWishCard(wishCardId);
      io.emit('unblock', {id: wishCardId});
      clearTimeout(blockedWishcardsTimer[wishCardId])
    }

    res.status(200).send({
      success: true,
      error: null,
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});
// @desc
// @route   GET '/wishcards/defaults/:id' (id represents age group category (ex: 1 for Babies))
// @access
// @tested 	No
router.get('/defaults/:id', async (req, res) => {
  const ageCategory = Number(req.params.id);
  let itemChoices;
  if (ageCategory === 1) itemChoices = babies;
  else if (ageCategory === 2) itemChoices = preschoolers;
  else if (ageCategory === 3) itemChoices = kids6_8;
  else if (ageCategory === 4) itemChoices = kids9_11;
  else if (ageCategory === 5) itemChoices = teens;
  else if (ageCategory === 6) itemChoices = youth;
  else if (ageCategory === 7) itemChoices = allAgesA;
  else itemChoices = allAgesB;
  res.render('itemChoices', { itemChoices }, (error) => {
    if (error) {
      handleError(res, 400, error);
    }
  },)
});

// @desc   Gets default wishcard options for guided wishcard creation
// @route  GET '/wishcards/defaults/:id' (id represents age group category (ex: 1 for Babies))
// @access Private (only for verified partners)
// @tested No
router.get(
  '/defaults/:id',
  renderPermissions,
  getDefaultCardsValidationRules(),
  validate,
  async (req, res) => {
    const ageCategory = Number(req.params.id);
    let itemChoices;

    switch (ageCategory) {
      case 1:
        itemChoices = babies;
        break;
      case 2:
        itemChoices = preschoolers;
        break;
      case 3:
        itemChoices = kids6_8;
        break;
      case 4:
        itemChoices = kids9_11;
        break;
      case 5:
        itemChoices = teens;
        break;
      case 6:
        itemChoices = youth;
        break;
      case 7:
        itemChoices = allAgesA;
        break;
      default:
        itemChoices = allAgesB;
        break;
    }

    res.render('itemChoices', { itemChoices }, (error, html) => {
      if (error) {
        handleError(res, 400, error);
      } else {
        res.status(200).send({ success: true, html });
      }
    });
  },
);

module.exports = router;
