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

module.exports = {
  redirectLogin,
  redirectProfile,
};
