const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

async function verifyGoogleToken(token) {
  const oauthClient = new OAuth2Client(process.env.G_CLIENT_ID);
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: process.env.G_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    firstName: payload.given_name,
    lastName: payload.family_name || 'LastnameUnset',
    mail: payload.email,
  };
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function createDefaultPassword() {
  return Math.random().toString(36).slice(-8);
}

module.exports = {
  verifyGoogleToken,
  hashPassword,
  createDefaultPassword,
};
