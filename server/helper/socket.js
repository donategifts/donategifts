const fs = require('fs');
const http = require('http');
const https = require('https');
const log = require('./logger');

let socketOptions = {};
let server;

if (process.env.LOCAL_DEVELOPMENT) {
  server = http.createServer();
} else {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/cert.pem'),
  };
  server = https.createServer(options);

  socketOptions = {
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': req.headers.origin, // or the specific origin you want to give access to,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  };
}

// eslint-disable-next-line import/order
const io = require('socket.io')(server, socketOptions);

const port = 3000; // Enter any of the cloudflare ports.

server.listen(port, () => {
  log.info(`socket listening on: ${port}`);
});

module.exports = io;
