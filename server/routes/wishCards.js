/*
serving all wishcard related routes
'/wishcards' is already mounted, so no need to start with it for each route.
/search/:keyword    /get/:id    /get/all    /get/random     /update/:id
*/

// NPM DEPENDENCIES
const express = require('express');

const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const io = require('../helper/socket');

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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const s3storage = multerS3({
  s3,
  bucket: process.env.S3BUCKET,
  acl: 'public-read',
  key(req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: process.env.USE_AWS ? s3storage : storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // up to 5 mbs
  },
  fileFilter,
});

// IMPORT REPOSITORIES
const UserRepository = require('../db/repository/UserRepository');
const MessageRepository = require('../db/repository/MessageRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');

// @desc    wishcard creation form sends data to db
// @route   POST '/wishcards'
// @access  Private, must be verified as a partner
// @tested 	Yes
router.post('/', upload.single('wishCardImage'), async (req, res) => {
  if (req.file === undefined) {
    handleError(res, 400, {
      success: false,
      error: `Error: File must be in jpeg, jpg, gif, or png format. The file
        must also be less than 5 megabytes.`,
    });
  } else {
    try {
      await WishCardRepository.createNewWishCard({
        childBirthday: new Date(req.body.childBirthday),
        wishItemPrice: Number(req.body.wishItemPrice),
        wishCardImage: req.file.location,
        createdBy: res.locals.user._id,
        // Uncomment once address fields are added to profile page.
        /* address: {
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.address_city,
          state: req.body.address_state,
          zip: req.body.address_zip,
          country: req.body.address_country,
        }, */
        ...req.body,
      });

      res.status(200).send('/wishcards/');
    } catch (error) {
      handleError(res, 400, error);
    }
  }
});

// @desc    wishcard creation form (guided process, i.e. uses default toy choices) sends data to db
// @route   POST '/wishcards/guided/'
// @access  Private, must be verified as a partner
// @tested 	Yes
router.post('/guided/', upload.single('wishCardImage'), async (req, res) => {
  if (req.file === undefined) {
    handleError(
      res,
      400,
      `Error: File must be in jpeg, jpg, gif, or png format. The file
        mst also be less than 5 megabytes.`,
    );
  } else {
    try {
      let { itemChoice } = req.body;
      itemChoice = JSON.parse(itemChoice);
      await WishCardRepository.createNewWishCard({
        childBirthday: new Date(req.body.childBirthday),
        wishItemName: itemChoice.Name,
        wishItemPrice: Number(itemChoice.Price),
        wishItemURL: itemChoice.ItemURL,
        wishCardImage: req.file.location,
        createdBy: res.locals.user._id,
        address: {
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.address_city,
          state: req.body.address_state,
          zip: req.body.address_zip,
          country: req.body.address_country,
        },
        ...req.body,
      });

      res.status(200).send('/wishcards/');
    } catch (error) {
      handleError(res, 400, error);
    }
  }
});

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards'
// @access  Public, all users can see
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
      socketUrl: process.env.SOCKET_URL
    });
  } catch (error) {
    handleError(res, 400, error);
  }
});

// @desc    search the wish cards by substring of wishItemName
// @route   POST '/wishcards/search'
// @access  Public, all users can see
// @tested 	Yes
router.post('/search', async (req, res) => {
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

// This needs to be moved elsewhere during Cleanup
const getMessageChoices = (userFirstName, childFirstName) => {
  if (!userFirstName || !childFirstName) {
    return [];
  }
  return [
    `${userFirstName} sends you love, ${childFirstName}`,
    'Happy Birthday to the sweetest kid in the entire world.',
    'Happy birthday to a future superstar!',
    `Happy birthday, ${childFirstName}`,
    `Merry Christmas, ${childFirstName}`,
    `Happy holidays, ${childFirstName}`,
    `${childFirstName}, you are awesome!`,
    `Lots of love and best wishes, ${childFirstName}`,
    `${childFirstName}, hope you enjoy my gift!`,
    'Merry Christmas and a Happy New Year',
    `${childFirstName}, have a happy holiday`,
    `Congratulations, ${childFirstName}`,
  ];
};

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
// @access  Public, all users (path led by "see more" button)
// @tested 	No
router.get('/:id', async (req, res) => {
  if (!res.locals.user) {
    // TO DO: Display alert instead? Hiding the See more button is another option
    res.redirect('/users/login');
  } else {
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
// @access  Private, only partners
// @tested 	Not yet
router.put('/update/:id', async (req, res) => {
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
});

// @desc   User can post a message to the wishcard
// @route  POST '/wishcards/message'
// @access  Public, all users
// @tested 	Not yet
router.post('/message', async (req, res) => {
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
});


// @desc   lock a wishcard
// @route  POST '/wishcards/message'
// @access  Public, all users
// @tested 	Not yet
router.post('/lock/:id', async (req, res) => {
  try {

    const wishCardId = req.params.id;

    if (!req.session.user) return handleError(res, 400, 'User not found');

    const user = await UserRepository.getUserByObjectId(req.session.user._id);
    if (!user) return handleError(res, 400, 'User not found');

    const wishcardAlreadyLockedByUser = await WishCardRepository.getLockedWishcardsByUserId(req.session.user._id);
    if(wishcardAlreadyLockedByUser) {
      // user has locked wishcard and its still locked

      if (moment(wishcardAlreadyLockedByUser.isLockedUntil) > moment()) {
        return handleError(res, 400, 'You already have a locked wishcard.');
      }
    }

    const lockedWishCard = await WishCardRepository.lockWishCard(wishCardId, user._id);

    io.emit('block', {id: wishCardId, lockedUntil: lockedWishCard.isLockedUntil})

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
  res.render('itemChoices', { itemChoices }, (error, html) => {
    if (error) {
      handleError(res, 400, error);
    } else {
      res.send(html);
    }
  });
});

module.exports = router;
