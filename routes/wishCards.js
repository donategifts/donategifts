/*
serving all wishcard related routes
'/wishcards' is already mounted, so no need to start with it for each route.
/create     /search/:keyword    /get/:id    /get/all    /get/random     /update/:id 
*/

//NPM DEPENDENCIES
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // up to 5 mbs
    },
    fileFilter: fileFilter
});

//IMPORT WISHCARD MODEL
const WishCard = require('../models/WishCard');

router.post('/', upload.single('wishCardImage'), (req, res) => {
    if (req.file === undefined) {
        res.send('Error: File must be in either .jpeg or .png format. The file \
        must also be less than 5 megabytes.');
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
            wishCardImage: req.file.path,
            createdBy: res.locals.user._id
        });
        newCard.save((err) => { if (err) console.log(err); });
        console.log(newCard);
        res.redirect('/wishcards');
    }
});

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards'
// @access  Public
// @tested 	Not yet
router.get('/', async (req, res) => {
    try {
        
	    var results = await WishCard.find({});
       console.log(results);
	    res.status(200).render('wishCards', {
            
		user: res.locals.user,
            wishcards: results
        });
	    
	    
    } catch (error) {
        res.status(400).send(JSON.stringify({
            success: false,
            error: error
        }));
    }
});

// @desc    search the wish cards by substring of wishItemName
// @route   POST '/wishcards/search'
// @access  Public
// @tested 	No
router.post('/search', async (req, res) => {
    try {
        const results = await WishCard.find({
            "wishItemName": {
                "$regex": req.body.wishitem,
                "$options": "i"
            }
        });
        res.status(200).render('wishCards', {
            user: res.locals.user,
            wishcards: results
        });
    } catch (error) {
        res.status(400).send(JSON.stringify({
            success: false,
            error: error
        }));
    }
});


// @desc    Retrieve a wishcard by its _id
// @route   GET '/wishcards/:id'
// @access  
// @tested 	
router.get('/:id', async (req, res) => {
    try {
        const result = await WishCard.findById(req.params.id);
        // Stacy: create a page and have a dynamic link for see more 
        res.send(result);
    } catch (error) {
        res.status(400).send(JSON.stringify({
            success: false,
            error: error
        }));
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
        res.status(400).send(JSON.stringify({
            success: false,
            error: error
        }));
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
        */
        result.save();
    } catch (error) {
        res.status(400).send(JSON.stringify({
            success: false,
            error: error
        }));
    }
});


module.exports = router;
