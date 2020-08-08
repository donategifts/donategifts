/*
serving all wishcard related routes
'/wishcards' is already mounted, so no need to start with it for each route.
/create     /search/:keyword    /get/:id    /get/all    /get/random     /update/:id     /delete/:id
*/

//NPM DEPENDENCIES
const express = require('express');
const router = express.Router();
const path = require('path');


//IMPORT WISHCARD MODEL
const WishCard = require('../models/WishCard');

//LOAD STATIC VIEWS
router.use(express.static('public'));
router.use(express.static('assets'));


// @desc    grab form inputs && save wishcard to db, then redirect to '/get/all' 
// @route   POST '/wishcards/create'
// @access  Private, only partners
// @tested 	Not yet
router.post('/create', (req, res) => {
    try {
        
    } catch (error) {

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
        res.status(200).sendFile( path.join( __dirname, '../public', 'wishCards.html' )); 
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
         
    } catch (error) {
        
    }
});

// @desc    Render wishCards.html which will show all wishcards
// @route   GET '/wishcards/get/all'
// @access  Public
// @tested 	Not yet
router.get('/get/all', (req, res) => {
    try {
        res.status(200).sendFile( path.join( __dirname, '../public', 'wishCards.html' )); 
    } catch (error) {
        res.status(400).send(JSON.stringify({
			success: false,
			error: err
		}));
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

// @desc    delete one wishcard by id 
// @route   DELETE '/wishcards/delete/:id'
// @access  Private, only partners
// @tested 	Not yet
router.delete('/update/:id', (req, res) => {
    try {
        
    } catch (error) {

    }
});

module.exports = router;