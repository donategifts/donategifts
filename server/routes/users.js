// NPM DEPENDENCIES

const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const path = require('path');

const {
  signupValidationRules,
  updateProfileValidationRules,
  createAgencyValidationRules,
  loginValidationRules,
  validate,
} = require('./validations/users.validations');
const { validateReCaptchaToken } = require('./validations/googleReCaptcha');
const { createEmailVerificationHash, sendVerificationEmail } = require('../controller/email');
const { handleError } = require('../helper/error');
const { log } = require('../helper/logger');

const UserRepository = require('../db/repository/UserRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');

// IMPORT AGENCY MODEL

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
    res.redirect('/users/profile');
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
    res.status(200).render(path.join(__dirname, '../../client/views/home'), {
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
    res.status(200).render(path.join(__dirname, '../../client/views/signup'), {
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
    res.status(200).render(path.join(__dirname, '../../client/views/login'), {
      user: res.locals.user,
      successNotification: null,
      errorNotification: null,
    });
  } catch (error) {
    handleError(
      res,
      400,
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
      const agency = await AgencyRepository.getAgencyByUserId(user._id);
      // If user hadn't filled out agency info, redirect them to form
      if (!agency) {
        return res.status(200).render(path.join(__dirname, '../../client/views/agency'));
      }
    }
    res.status(200).render('profile');
  } catch (err) {
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

      const candidate = await UserRepository.getUserByObjectId(req.session.user._id);

      // candidate with id not found in database, return not found status 404
      if (!candidate) {
        return handleError(res, 404, 'User could not be found');
      }

      // update user and add aboutMe;
      await UserRepository.updateUserById(candidate._id, aboutMe);

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
    res.render(path.join(__dirname, '../../client/views/agency'), {
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

  await AgencyRepository.createNewAgency({
    agencyName,
    agencyWebsite,
    agencyPhone,
    agencyBio,
    accountManager: req.session.user._id,
  });

  try {
    return res.status(200).send({
      success: true,
      user: req.session.user,
      url: '/users/profile',
    });
  } catch (err) {
    return handleError(res, 400, err);
  }
});

const sendEmail = async (email, verificationHash) => {
  const emailResponse = await sendVerificationEmail(email, verificationHash);
  const response = emailResponse ? emailResponse.data : '';
  if (process.env.NODE_ENV === 'development') log(response);
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

  const candidate = await UserRepository.getUserByEmail(email);
  if (candidate) {
    return handleError(res, 409, 'This email is already taken. Try another');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationHash = createEmailVerificationHash();

  const newUser = await UserRepository.createNewUser({
    fName,
    lName,
    email,
    verificationHash,
    password: hashedPassword,
    userRole,
  });

  try {
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

  const user = await UserRepository.getUserByEmail(email);
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.locals.user = user;
      return res.redirect('/users/profile');
    }
    return res.status(403).render(path.join(__dirname, '../../client/views/login'), {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Username and/or password incorrect' },
    });
  }
  return res.status(403).render(path.join(__dirname, '../../client/views/login'), {
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
    res.render(path.join(__dirname, '../../client/views/terms'), {
      user: res.locals.user,
    });
  } catch (err) {
    handleError(res, 400, err);
  }
});

// @desc    Render login.html
// @route   GET '/users/verify'
// @access  Public
// @tested 	Not yet
router.get('/verify/:hash', async (req, res) => {
  try {
    const user = await UserRepository.getUserByVerificationHash(req.params.hash);

    if (user) {
      if (user.emailVerified) {
        return res.status(200).render(path.join(__dirname, '../../client/views/login'), {
          user: res.locals.user,
          successNotification: {
            msg: 'Your email is already verified.',
          },
          errorNotification: null,
        });
      }
      user.emailVerified = true;
      user.save();

      return res.status(200).render(path.join(__dirname, '../../client/views/login'), {
        user: res.locals.user,
        successNotification: {
          msg: 'Email Verification successful',
        },
        errorNotification: null,
      });
    }
    return res.status(400).render(path.join(__dirname, '../../client/views/login'), {
      user: res.locals.user,
      successNotification: null,
      errorNotification: { msg: 'Email Verification failed' },
    });
  } catch (error) {
    return res.status(500).render(path.join(__dirname, '../../client/views/login'), {
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
      const agency = await AgencyRepository.getAgencyByUserId(user._id);
      if (!agency) {
        return handleError(res, 404, 'Agency Not Found');
      }
      params = { ...params, agency };
    }
    res.render(path.join(__dirname, '../../client/views/chooseItem'), params);
  } catch (err) {
    return handleError(res, 400, err);
  }
});

module.exports = router;
