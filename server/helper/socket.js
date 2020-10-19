const app = require('../app');
const https        = require('https');
const fs = require( 'fs' );
const server = https.createServer({     
  key: fs.readFileSync('/etc/letsencrypt/live/wsdev.donate-gifts.com/privkey.pem'),     
  cert: fs.readFileSync('/etc/letsencrypt/live/wsdev.donate-gifts.com/cert.pem'),     
  ca: fs.readFileSync('/etc/letsencrypt/live/wsdev.donate-gifts.com/chain.pem'),     
  requestCert: false,     
  rejectUnauthorized: false },app); 
server.listen(3000);

const io = require('socket.io').listen(server);

io.set('origins', '*:*');

module.exports = io
