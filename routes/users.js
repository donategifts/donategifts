// NPM DEPENDENCIES

const { v4: uuidv4 } = require('uuid');

const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');


const {
  signupValidationRules,
  updateProfileValidationRules,
  createAgencyValidationRules,
  loginValidationRules,
  passwordResetValidationRules,
  validate,
} = require('./validations/users.validations');

const { validateReCaptchaToken } = require('./validations/googleReCaptcha');

const { createEmailVerificationHash, sendVerificationEmail, sendPasswordResetMail } = require('../controllers/email');

const { handleError } = require('../middleware/error');

// IMPORT USER MODEL
const User = require('../models/User');

// IMPORT AGENCY MODEL
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
    return handleError(res, 400, err);
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
    return handleError(res, 400, err);
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
        error,
      }),
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
    const { user } = req.session;
    if (user.userRole === 'partner') {
      const agency = await Agency.findOne({ accountManager: user._id });
      // If user hadn't filled out agency info, redirect them to form
      if (!agency) {
        return res.status(200).render('agency');
      }
    }
    res.status(200).render('profile');
  } catch (err) {
    console.log(err);
    return handleError(res, 400, err);
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
        return handleError(res, 403, 'No user id in request');
      }

      const candidate = await User.findOne({ _id: req.session.user._id });

      // candidate with id not found in database, return not found status 404
      if (!candidate) {
        return handleError(res, 404, 'User could not be found');
      }

      // update user and add aboutMe;
      await User.findByIdAndUpdate({ _id: candidate._id }, { $set: { aboutMe } });

      res.status(200).send(
        JSON.stringify({
          success: true,
          error: null,
          data: aboutMe,
        }),
      );
    } catch (err) {
      return handleError(res, 400, err);
    }
  },
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
    return handleError(res, 400, err);
  }
});

// @desc    agency info is sent to db
// @route   POST '/users/agency'
// @access  private, partners only
// @tested 	No
router.post('/agency', createAgencyValidationRules(), validate, async (req, res) => {
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

    return res.status(200).send({
      success: true,
      user: req.session.user,
      url: '/users/profile',
    });
  } catch (err) {
    console.log(err);
    return handleError(res, 400, err);
  }
});

const sendEmail = async (email, verificationHash) => {
  const emailResponse = await sendVerificationEmail(email, verificationHash);
  const response = emailResponse ? emailResponse.data : '';
  if (process.env.NODE_ENV === 'development') console.log(response);
};

// @desc    Create a newUser, hash password, issue session
// @route   POST '/users/signup'
// @access  Public
// @tested 	Yes
// TODO: display this message in signup.html client side as a notification alert.
router.post('/signup', signupValidationRules(), validate, async (req, res) => {
  const { fName, lName, email, password, userRole, captchaToken } = req.body;

  // validate captcha code. False if its invalid
  const isCaptchaValid = await validateReCaptchaToken(captchaToken);
  if (isCaptchaValid === false) {
    return handleError(res, 400, {
      message: {
        msg: 'Provided captcha token is not valid',
        param: 'captchaToken',
        location: 'body',
      },
    });
  }

  const candidate = await User.findOne({
    email,
  });
  if (candidate) {
    return handleError(res, 409, 'This email is already taken. Try another');
  }
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
    // trying to add a second step here
    // if the userRole is partner then redirect to agency.ejs then profile.ejs

    sendEmail(email, verificationHash);
    let url;
    req.session.user = newUser;
    if (newUser.userRole === 'partner') {
      url = '/users/agency';
    } else {
      url = '/users/profile';
    }
    return res.status(200).send({
      success: true,
      user: newUser,
      url,
    });
  } catch (err) {
    return handleError(res, 206, err);
  }
});

// @desc    Render login.html
// @route   POST '/users/login'
// @access  Public
// @tested 	Not yet
router.post('/login', loginValidationRules(), validate, redirectProfile, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.locals.user = user;
      return res.redirect('/users/profile');
    }
    return res.status(403).render('login', {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Username and/or password incorrect' },
    });
  }
  return res.status(403).render('login', {
    user: res.locals.user,
    successNotification: null,
    errorNotification: { msg: 'Username and/or password incorrect' },
  });
});

// @desc    Render login.html
// @route   GET '/users/logout'
// @access  Public
// @tested 	Not yet
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(() => {
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
      }),
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
            msg: 'Your email is already verified.',
          },
          errorNotification: null,
        });
      }
      user.emailVerified = true;
      user.save();

      return res.status(200).render('login', {
        user: res.locals.user,
        successNotification: {
          msg: 'Email Verification successful',
        },
        errorNotification: null,
      });
    }
    return res.status(400).render('login', {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Email Verification failed' },
    });
  } catch (error) {
    return res.status(500).render('login', {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Email Verification failed' },
    });
  }
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/choose', redirectLogin, async (req, res) => {
  try {
    const { user } = res.locals;
    let params = { user };
    if (user.userRole === 'partner') {
      const agency = await Agency.findOne({ accountManager: user._id });
      if (!agency) {
        return handleError(res, 404, 'Agency Not Found');
      }
      params = { ...params, agency };
    }
    res.render('chooseItem', params);
  } catch (err) {
    return handleError(res, 400, err);
  }
});


// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/password/request', async (req, res) => {
  try {
    res.render('requestPassword')

  } catch (err) {
    return handleError(res, 400, err);
  }
});


// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.post('/password/request', async (req, res) => {
  try {

    if (!req.body.email) return handleError(res, 400, 'email missing');

    const userObject = await User.findOne({ email: req.body.email });

    if (!userObject) return handleError(res, 400, 'user not found');

    const resetToken = uuidv4();
    userObject.passwordResetToken = resetToken;
    userObject.passwordResetTokenExpires = moment().add(1, 'hours');
    userObject.save();

    sendPasswordResetMail(userObject.email, resetToken);

    res.send({success: true})

  } catch (err) {
    return handleError(res, 400, err);
  }
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.get('/password/reset/:token', async (req, res) => {
  try {

    const userObject = await User.findOne({ passwordResetToken: req.params.token });

    if (userObject) {

      if (moment(userObject.passwordResetTokenExpires) > moment()) {

        res.render('resetPassword', {
          token: req.params.token
        })

      } else {
        return handleError(res, 400, 'Password token expired');
      }

    } else {

      return handleError(res, 400, 'User not found');

    }

  } catch (err) {
    return handleError(res, 400, err);
  }
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/choose'
// @access  Private
// @tested
router.post('/password/reset/:token', passwordResetValidationRules(), validate, async (req, res) => {
  try {

      const userObject = await User.findOne({ passwordResetToken: req.params.token });

      if (userObject) {

        if (moment(userObject.passwordResetTokenExpires) > moment()) {

          const salt = await bcrypt.genSalt(10);

          userObject.password = await bcrypt.hash(req.body.password, salt);
          userObject.passwordResetToken = null;
          userObject.passwordResetTokenExpires = null;
          userObject.save();

          req.session.destroy(() => {
            res.clearCookie(process.env.SESS_NAME);
          });

          res.send({success: true})

        } else {
          return handleError(res, 400, 'Password token expired');
        }

      } else {

        return handleError(res, 400, 'User not found');

      }

  } catch (err) {
    return handleError(res, 400, err);
  }
});

module.exports = router;
