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

// SET STORAGE ENGINE
const storage = multer.diskStorage({
	destination: '../public/uploads',
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + 
		path.extname(file.originalname));
	}
});

// INIT UPLOAD 
const upload = multer({
    storage: storage,
    limits: {fileSize: 10}
}).single('photo');


//IMPORT WISHCARD MODEL
const WishCard = require('../models/WishCard');



// @desc    grab form inputs && save wishcard to db, then redirect to '/wishcards' 
// @route   POST '/wishcards'
// @access  Private, only partners
// @tested 	Not yet
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send({ success: false, msg: err });
        } else {
            console.log(req.file);
            /*
            TODO: saving image logic 
            */
            res.send({ success: true, redirectURL: '/wishcards'});
        }
    });
});

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards'
// @access  Public
// @tested 	Not yet
router.get('/', (req, res) => {
    try {
        res.status(200).render('wishCards', {user: res.locals.user}); 
    } catch (error) {
        res.status(400).send(JSON.stringify({
			success: false,
			error: err
		}));
    }
});

// @desc    search the wish cards by substring of wishItemName
// @route   GET '/wishcards/search/:keyword'
// @access  Public
// @tested 	No
router.get('/search/:keyword', async (req, res) => {
    try {
        //TODO : finish this
        // I made a #searchBar in the wishCards.html
        // so keyword will be a string from user's input text
        // kinda like how we searched items for Ostaa2
        const findCard = await WishCard.find({
            "description": {
                "$regex": keyword,
                "$options": "i"
            }
        });
        res.status(200).render('wishCards', {user: res.locals.user}); 
    } catch (error) {
        //we don't have to do this so change this to whatever you want
        res.status(400).send(JSON.stringify({
			success: false,
			error: err
		}));
    }
});

// @desc    Retrieve a wishcard by its _id
// @route   GET '/wishcards/get/:id'
// @access  
// @tested 	
router.get('/get/:id', (req, res) => {
    try {
         
    } catch (error) {
        
    }
});

// @desc    display 3 wishcards randomly in the sample wishcard section of index.html 
// @route   GET '/wishcards/get/random'
// @access  Public
// @tested 	No
router.get('/get/random', (req, res) => {
    try {
         //TODO: /views/templates/homeSampleCards.ejs
         //     has all the frontend codes for this random display 
    } catch (error) {
        
    }
});

// @desc    update one wishcard by id 
// @route   PUT '/wishcards/update/:id'
// @access  Private, only partners
// @tested 	Not yet
router.put('/update/:id', (req, res) => {
    try {
        
    } catch (error) {

    }
});


module.exports = router;