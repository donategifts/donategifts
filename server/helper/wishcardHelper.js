const AgencyRepository = require('../db/repository/AgencyRepository');

const IfNull = ({ agency, foundAgency }) => {
  if (!agency || !foundAgency) {
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
  if (IfNull(info) || !foundAgency._id.equals(agency._id) || NotVerified(info)) {
    return true;
  }
  return false;
};

const renderPermissions = async (req, res, next) => {
  const { user, agency } = req.session;
  const userInfo = { user, agency };
  if (!user) {
    res.status(403).send({ success: false, url: '/users/login' });
  } else if (await IfNullOrNotVerifiedAgency(userInfo)) {
    res.status(403).send({ success: false, url: '/users/profile' });
  } else {
    next();
  }
};

module.exports = {
  renderPermissions,
};
