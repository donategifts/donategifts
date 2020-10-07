/*
serving all wishcard related routes
'/wishcards' is already mounted, so no need to start with it for each route.
/search/:keyword    /get/:id    /get/all    /get/random     /update/:id
*/

//NPM DEPENDENCIES
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

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
  s3: s3,
  bucket: process.env.S3BUCKET,
  acl: 'public-read',
  key: function (req, file, cb) {
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
  storage: s3storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // up to 5 mbs
  },
  fileFilter: fileFilter,
});

//IMPORT MODELS
const WishCard = require('../models/WishCard');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    wishcard creation form sends data to db
// @route   POST '/wishcards'
// @access  Private, must be verified as a partner
// @tested 	Yes
router.post('/', upload.single('wishCardImage'), (req, res) => {
  if (req.file === undefined) {
    res.send(
      'Error: File must be in jpeg, jpg, gif, or png format. The file \
        must also be less than 5 megabytes.'
    );
  } else {
    try {
      let newCard = new WishCard({
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
      newCard.save((err) => {
        if (err) {
          res.status(400).json({ success: false, error: err });
        } else {
          res.status(200).json({ success: true });
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
});

// @desc    wishcard creation form (guided process, i.e. uses default toy choices) sends data to db
// @route   POST '/wishcards/guided/'
// @access  Private, must be verified as a partner
// @tested 	Yes
router.post('/guided/', upload.single('wishCardImage'), (req, res) => {
  if (req.file === undefined) {
    res.send(
      'Error: File must be in jpeg, jpg, gif, or png format. The file \
        must also be less than 5 megabytes.'
    );
  } else {
    try {
      let { itemChoice } = req.body;
      itemChoice = JSON.parse(itemChoice);
      let newCard = new WishCard({
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
      newCard.save((err, data) => {
        if (err) {
          console.log(err);
          res.status(400).json({ success: false, error: err });
        } else {
          res.status(200).json({ success: true, error: 'No error' });
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
});

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards'
// @access  Public, all users can see
// @tested 	Yes
router.get('/', async (req, res) => {
  try {
    var results = await WishCard.find({});
    res.status(200).render('wishCards', {
      user: res.locals.user,
      wishcards: results,
    });
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
});

// @desc    search the wish cards by substring of wishItemName
// @route   POST '/wishcards/search'
// @access  Public, all users can see
// @tested 	Yes
router.post('/search', async (req, res) => {
  try {
    const results = await WishCard.find({
      wishItemName: {
        $regex: req.body.wishitem,
        $options: 'i',
      },
    });
    res.status(200).render('wishCards', {
      user: res.locals.user,
      wishcards: results,
    });
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
});

// This needs to be moved elsewhere during Cleanup
let getMessageChoices = (userFirstName, childFirstName) => {
  if (!userFirstName | !childFirstName) {
    return [];
  } else {
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
  }
};

let getPreviousMessages = async (wishcard) => {
  let messages = [];
  if (wishcard.messages.length > 0) {
    messages = await Promise.all(
      wishcard.messages.map(async (messageID) => {
        let foundMessage = await Message.findById(messageID);
        let foundUser = await User.findById(foundMessage.messageFrom);
        return {
          message: foundMessage.message,
          fromUser: foundUser.fName,
        };
      })
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
      let wishcard = await WishCard.findById(req.params.id);
      let messages = await getPreviousMessages(wishcard);
      let defaultMessages = getMessageChoices(
        res.locals.user.fName,
        wishcard.childFirstName
      );
      // create a page and have a dynamic link for see more
      res.status(200).render('wishCardFullPage', {
        user: res.locals.user,
        wishcard: wishcard ? wishcard : [],
        messages,
        defaultMessages,
      });
    } catch (error) {
      res.status(400).send(
        JSON.stringify({
          success: false,
          error: error,
        })
      );
    }
  }
});

// @desc    display 3 wishcards randomly in the sample wishcard section of index.html
// @route   GET '/wishcards/get/random'
// @access  Public
// @tested 	No
router.get('/get/random', async (req, res) => {
  try {
    let wishcards = await WishCard.find({});
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
        res.send(html);
      }
    });
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
});

// @desc    update one wishcard by id
// @route   PUT '/wishcards/update/:id'
// @access  Private, only partners
// @tested 	Not yet
router.put('/update/:id', async (req, res) => {
  try {
    const result = await WishCard.findById(req.params.id);
    /*
        WHERE ARE WE EDITING THIS ON THE FRONT END?
            - in /users/profile
            - all wishcards created by this user should display
            - then add a pencil icon for edit function
        */
    result.save();
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
});

// @desc   User can post a message to the wishcard
// @route  POST '/wishcards/message'
// @access  Public, all users
// @tested 	Not yet
router.post('/message', async (req, res) => {
  try {
    const { messageFrom, messageTo, message } = req.body;
    const newMessage = new Message({ messageFrom, messageTo, message });
    await newMessage.save();

    let updatedWishCard = await WishCard.findByIdAndUpdate(
      { _id: messageTo._id },
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (updatedWishCard) {
      res.status(200).send(
        JSON.stringify({
          success: true,
          error: null,
          data: newMessage,
        })
      );
    } else {
      res.status(400).send(
        JSON.stringify({
          success: false,
        })
      );
    }
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: error,
      })
    );
  }
});

// Move this later when cleaning up this route
let {
  babies,
  preschoolers,
  kids6_8,
  kids9_11,
  teens,
  youth,
  allAgesA,
  allAgesB,
} = require('../utilities/defaultItems');

// @desc
// @route   GET '/wishcards/defaults/:id' (id represents age group category (ex: 1 for Babies))
// @access
// @tested 	No
router.get('/defaults/:id', async (req, res) => {
  let ageCategory = Number(req.params.id);
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
      res.status(400).json({ success: false, error });
    } else {
      res.send(html);
    }
  });
});

module.exports = router;
