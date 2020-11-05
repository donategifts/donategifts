import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

async function verifyGoogleToken(
  token: string,
): Promise<{
  firstName?: string;
  lastName: string;
  mail?: string;
}> {
  const oauthClient = new OAuth2Client(process.env.G_CLIENT_ID);
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: process.env.G_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    firstName: payload?.given_name,
    lastName: payload?.family_name || 'LastnameUnset',
    mail: payload?.email,
  };
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function createDefaultPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export { verifyGoogleToken, hashPassword, createDefaultPassword };
