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
  bucket: process.env.bucket,
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
    var newCard = new WishCard({
      childFirstName: req.body.childFirstName,
      childLastName: req.body.childLastName,
      childBirthday: new Date(req.body.childBirthday),
      childInterest: req.body.childInterest,
      wishItemName: req.body.wishItemName,
      wishItemPrice: Number(req.body.wishItemPrice),
      wishItemURL: req.body.wishItemURL,
      childStory: req.body.childStory,
      wishCardImage: req.file.location,
      createdBy: res.locals.user._id,
    });
    newCard.save((err) => {
      if (err) console.log(err);
    });
    console.log(newCard);
    res.redirect('/wishcards');
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
      let messages;
      if (wishcard.messages.length > 0) {
        messages = await Promise.all(
          wishcard.messages.map(async (messageID) => {
            let foundMessage = await Message.findById(messageID);
            let foundUser = await User.findById(foundMessage.messageFrom);
            return { message: foundMessage.message, fromUser: foundUser.fName };
          })
        );
      }
      // create a page and have a dynamic link for see more
      res.status(200).render('wishCardFullPage', {
        user: res.locals.user,
        wishcard,
        messages,
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
    //TODO: /views/templates/homeSampleCards.ejs
    //     has all the frontend codes for this random display
    const results = await WishCard.find({});
    results.sort(() => Math.random() - 0.5); // [wishcard object, wishcard object, wishcard object]
    res.send(results.slice(0, 3));
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

module.exports = router;
