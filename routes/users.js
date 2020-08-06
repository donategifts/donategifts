//TODO: authorize 'admin'

const express = require('express');

const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		res.redirect('/login');
	} else {
		next();
	}
}

const redirectProfile = (req, res, next) => {
	if (req.session.userId) {
		res.redirect('/profile');
	} else {
		next();
	}
}

const {
    getUsersRoot,
    getUsersProfile,
    getUsersLogin,
    getUsersRegister,
    postUsersLogin, 
    postUsersRegister, 
    postUsersLogout
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({
    mergeParams: true
});

router
    .route('/')
    .get(getUsersRoot);

router
    .route('/profile')
    .get(redirectLogin, getUsersProfile);

router
    .route('/login')
    .get(redirectProfile, getUsersLogin);

router
    .route('/register')
    .get(redirectProfile, getUsersRegister);

router
    .route('/login')
    .post(redirectProfile, postUsersLogin);

router
    .route('/register')
    .post(redirectProfile, postUsersRegister);

router
    .route('/logout')
    .post(redirectLogin, postUsersLogout);    

module.exports = router;