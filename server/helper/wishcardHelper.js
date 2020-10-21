const AgencyRepository = require('../db/repository/AgencyRepository');

const IfNull = ({ agency, foundAgency }) => {
  if (agency === null || foundAgency === null) {
    return true;
  }
  return false;
};

const NotVerified = ({ user, foundAgency }) => {
  if (user.userRole !== 'partner' || !foundAgency.isVerified) {
    return true;
  }
  return false;
};

const IfNullOrNotVerifiedAgency = async (userInfo) => {
  const { user, agency } = userInfo;
  const foundAgency = await AgencyRepository.getAgencyByUserId(user._id);
  const info = { foundAgency, ...userInfo };
  if (!foundAgency._id.equals(agency._id) || IfNull(info) || NotVerified(info)) {
    return true;
  }
  return false;
};

const checkPermissions = async (req, res, next) => {
  const { user, agency } = req.session;
  const userInfo = { user, agency };
  if (user === null) {
    res.status(403).redirect('/login');
  } else if (await IfNullOrNotVerifiedAgency(userInfo)) {
    res.status(403).redirect('/users/profile');
  } else {
    next();
  }
};

const renderPermissions = async (req, res, next) => {
  const { user, agency } = req.session;
  const userInfo = { user, agency };
  if (user === null) {
    res.status(403).send({ url: '/login' });
  } else if (await IfNullOrNotVerifiedAgency(userInfo)) {
    res.status(403).send({ url: '/users/profile' });
  } else {
    next();
  }
};

module.exports = {
  checkPermissions,
  renderPermissions,
};
