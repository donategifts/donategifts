//TODO: delete, update

const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc      Get all users
// @route     GET /get/auth/users/
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
    // check if they are admin first ()
    User.find({}, (err, results) => {
        res.status(200).json(results);
    });
};

// @desc      Get single user
// @route     GET /get/auth/users/:id
// @access    Private/Admin
exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

// @desc      Create user
// @route     POST /users/
// @access    Public
exports.addUser = async (req, res, next) => {
    User.find({}).remove().exec();  
    console.log(req.session);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.status(201).json({
        redirectUrl: "..",
        success: true
    });
};