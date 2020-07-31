//TODO: delete, update

const User = require('../models/User');

// @desc      Get all users
// @route     GET /get/auth/users/
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
// @route     POST /add/auth/users/
// @access    Public
exports.addUser = async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
};