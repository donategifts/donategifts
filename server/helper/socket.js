const fs = require('fs');
const http = require('http');
const https = require('https');
const log = require('./logger');

function connectSocket(app) {
  let server;
  if (process.env.LOCAL_DEVELOPMENT) {
    server = http.createServer(app);
  } else {
    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/cert.pem'),
    };

    server = https.createServer(app, options);
  }

  const io = require('socket.io')(server, {
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': req.headers.origin, // or the specific origin you want to give access to,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  });

  server.listen(8081, () => {
    log.info(`socket listening on: ${8081}`);
  });

  return io;
}

module.exports = { connectSocket };
