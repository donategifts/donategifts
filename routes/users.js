//TODO: authorize 'admin'

const express = require('express');

const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		res.redirect('/login');
	} else {
		next();
	}
}

const redirectHome = (req, res, next) => {
	if (req.session.userId) {
		res.redirect('/home');
	} else {
		next();
	}
}

const {
    getUsersRoot,
    getUsersHome,
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
    .route('/home')
    .get(redirectLogin, getUsersHome);

router
    .route('/login')
    .get(redirectHome, getUsersLogin);

router
    .route('/register')
    .get(redirectHome, getUsersRegister);

router
    .route('/login')
    .post(redirectHome, postUsersLogin);

router
    .route('/register')
    .post(redirectHome, postUsersRegister);

router
    .route('/logout')
    .post(redirectLogin, postUsersLogout);    

module.exports = router;