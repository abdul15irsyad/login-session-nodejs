const { google } = require('googleapis')
const oauth2 = google.oauth2('v2')
require('dotenv').config()

const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/plus.me',
];

const Oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL, // this must match your google api settings
);

async function getConnectionUrl() {
  const url = await Oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
  return url;
}

async function getUserDetails(code) {
  const { tokens } = await Oauth2Client.getToken(code);
  Oauth2Client.setCredentials(tokens);
  const usr_info = await oauth2.userinfo.get({
    auth: Oauth2Client
  });
  return usr_info;
}

module.exports = {
  getConnectionUrl,
  getUserDetails,
};