//NPM DEPENDENCIES

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const {
  signupValidationRules,
  updateProfileValidationRules,
  createAgencyValidationRules,
  loginValidationRules,
  validate,
} = require('./validations/users.validations');

const {
  sendMail,
  createEmailVerificationHash,
  sendVerificationEmail,
} = require('../controllers/email');

//IMPORT USER MODEL
const User = require('../models/User');

//IMPORT AGENCY MODEL
const Agency = require('../models/Agency');

// Middleware for users
const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/users/login');
  } else {
    next();
  }
};
const redirectProfile = (req, res, next) => {
  if (req.session.user) {
    res.redirect(`/users/profile`);
  } else {
    next();
  }
};

const sendError = (res, status, err) => {
  res.status(status).send({
    success: false,
    error: err,
  });
};

// @desc    Render (home)
// @route   GET '/users'
// @access  Public
// @tested 	Yes
router.get('/', (req, res) => {
  try {
    res.status(200).render('home', {
      user: res.locals.user,
    });
  } catch (err) {
    return sendError(res, 400, err);
  }
});

// @desc    Render signup.html
// @route   GET '/users/signup'
// @access  Public
// @tested 	Yes
router.get('/signup', redirectProfile, (req, res) => {
  try {
    res.status(200).render('signup', {
      user: res.locals.user,
    });
  } catch (err) {
    return sendError(res, 400, err);
  }
});

// @desc
// @route   GET '/users/login'
// @access  Private
// @tested 	yes
router.get('/login', redirectProfile, (req, res) => {
  try {
    res.status(200).render('login', {
      user: res.locals.user,
      successNotification: null,
      errorNotification: null,
    });
  } catch (error) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: err,
      })
    );
  }
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/profile'
// @access  Private, only users
// @tested 	Yes
// TODO: add conditions to check userRole and limit 'createWishCard' access to 'partners' only
router.get('/profile', redirectLogin, async (req, res) => {
  try {
    let user = req.session.user;
    let params = { user };
    if (user.userRole === 'partner') {
      let agency = await Agency.findOne({ accountManager: user._id });
      if (!agency) {
        return res.render('agency');
      }
      params = { ...params, agency };
    }
    res.render('profile', params);
  } catch (err) {
    console.log(err);
    return sendError(res, 400, err);
  }
});

// @desc    Update user about me info
// @route   PUT '/users/profile'
// @access  Private, only users
// @tested 	No?
router.put(
  '/profile',
  updateProfileValidationRules(),
  validate,
  redirectLogin,
  async (req, res) => {
    try {
      const { aboutMe } = req.body;

      // if no user id is present return forbidden status 403
      if (!req.session.user) {
        return sendError(res, 403, 'No user id in request');
      }

      const candidate = await User.findOne({ _id: req.session.user._id });

      // candidate with id not found in database, return not found status 404
      if (!candidate) {
        return sendError(res, 404, 'User could not be found');
      }

      // update user and add aboutMe
      User.updateOne(
        { _id: candidate._id },
        { aboutMe: aboutMe },
        { multi: true }
      );

      res.status(200).send(
        JSON.stringify({
          success: true,
          error: null,
          data: aboutMe,
        })
      );
    } catch (err) {
      return sendError(res, 400, err);
    }
  }
);

// @desc    Render agency.ejs
// @route   GET '/users/agency'
// @access  Private, only userRole == partners
// @tested 	No
router.get('/agency', redirectLogin, async (req, res) => {
  try {
    res.render('agency', {
      user: res.locals.user,
    });
  } catch (err) {
    return sendError(res, 400, err);
  }
});

// @desc    agency info is sent to db
// @route   POST '/users/agency'
// @access  private, partners only
// @tested 	No
router.post(
  '/agency',
  createAgencyValidationRules(),
  validate,
  async (req, res) => {
    const { agencyName, agencyWebsite, agencyPhone, agencyBio } = req.body;

    const newAgency = new Agency({
      agencyName,
      agencyWebsite,
      agencyPhone,
      agencyBio,
      accountManager: req.session.user._id,
    });
    try {
      await newAgency.save();

      req.session.agencyId = mongoose.Types.ObjectId(newAgency._id);
      res.send('/users/profile');
    } catch (err) {
      console.log(err);
      return sendError(res, 400, err);
    }
  }
);

// @desc    Create a newUser, hash password, issue session
// @route   POST '/users/signup'
// @access  Public
// @tested 	Yes
// TODO: display this message in signup.html client side as a notification alert
router.post('/signup', signupValidationRules(), validate, async (req, res) => {
  const { fName, lName, email, password, userRole } = req.body;
  const candidate = await User.findOne({
    email: email,
  });
  if (candidate) {
    return sendError(res, 409, 'This email is already taken. Try another');
  } else {
    if (!password) return sendError(res, 206, { message: 'Password missing' });
    if (!userRole) return sendError(res, 206, { message: 'userRole missing' });
    if (!fName) return sendError(res, 206, { message: 'fName missing' });
    if (!lName) return sendError(res, 206, { message: 'lName missing' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationHash = createEmailVerificationHash();

    const newUser = new User({
      fName,
      lName,
      email,
      verificationHash,
      password: hashedPassword,
      userRole,
    });
    try {
      await newUser.save();
      //trying to add a second step here
      //if the userRole is partner then redirect to agency.ejs then profile.ejs

      const emailResponse = await sendVerificationEmail(
        email,
        verificationHash
      );

      return res.status(200).send({
        success: true,
        dev: process.env.NODE_ENV === 'development',
        user: newUser,
        email: emailResponse ? emailResponse.data : '',
      });
    } catch (err) {
      return sendError(res, 206, err);
    }
  }
});

// @desc    Render login.html
// @route   POST '/users/login'
// @access  Public
// @tested 	Not yet
router.post(
  '/login',
  loginValidationRules(),
  validate,
  redirectProfile,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
    });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        if (!user.emailVerified) {
          return res.status(403).render('login', {
            user: res.locals.user,
            successNotification: null,
            errorNotification: { msg: 'Please verify your Email' },
          });
        }

        req.session.user = user;
        res.locals.user = user;
        return res.redirect('/users/profile');
      } else {
        return res.status(403).render('login', {
          user: res.locals.user,
          successNotification: null,
          errorNotification: { msg: 'Username and/or password incorrect' },
        });
      }

      req.session.user = user;
      res.locals.user = user;
      return res.redirect('/users/profile');
    } else {
      return res.status(403).render('login', {
        user: res.locals.user,
        successNotification: null,
        errorNotification: { msg: 'Username and/or password incorrect' },
      });
    }

    res.redirect('/users/login');
  }
);

// @desc    Render login.html
// @route   GET '/users/logout'
// @access  Public
// @tested 	Not yet
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie(process.env.SESS_NAME);
    res.redirect('/users/login');
  });
});

// @desc    Render terms.ejs
// @route   GET '/users/terms'
// @access  public
// @tested 	No
router.get('/terms', async (req, res) => {
  try {
    res.render('terms', {
      user: res.locals.user,
    });
  } catch (err) {
    res.status(400).send(
      JSON.stringify({
        success: false,
        error: err,
      })
    );
  }
});

// @desc    Render login.html
// @route   GET '/users/verify'
// @access  Public
// @tested 	Not yet
router.get('/verify/:hash', async (req, res) => {
  try {
    const user = await User.findOne({
      verificationHash: req.params.hash,
    });

    if (user) {
      if (user.emailVerified) {
        return res.status(200).render('login', {
          user: res.locals.user,
          successNotification: {
            msg: 'Your email is already verified, you can login now!',
          },
          errorNotification: null,
        });
      }
      user.emailVerified = true;
      user.save();

      return res.status(200).render('login', {
        user: res.locals.user,
        successNotification: {
          msg: 'Verification successful, you can login now!',
        },
        errorNotification: null,
      });
    } else {
      return res.status(400).render('login', {
        user: res.locals.user,
        successNotification: null,
        errorNotification: { msg: 'Verification failed' },
      });
    }
  } catch (error) {
    return res.status(500).render('login', {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Verification failed' },
    });
  }
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/choose', redirectLogin, async (req, res) => {
  try {
    let user = res.locals.user;
    let params = { user };
    if (user.userRole === 'partner') {
      let agency = await Agency.findOne({ accountManager: user._id });
      if (!agency) {
        return sendError(res, 404, 'Agency Not Found');
      }
      params = { ...params, agency };
    }
    res.render('chooseItem', params);
  } catch (err) {
    return sendError(res, 400, err);
  }
});

module.exports = router;
