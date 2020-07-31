//TODO: authorize 'admin'

const express = require('express');
const {
    getUsers,
    getUser,
    addUser
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({
    mergeParams: true
});

router
    .route('/')
    .get(getUsers)
    .post(addUser);

router
    .route('/:id')
    .get(getUser);

module.exports = router;