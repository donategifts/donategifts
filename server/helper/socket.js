const fs = require('fs');
const http = require('http');
const https = require('https');
const log = require('./logger');

let io;
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

  io = require('socket.io')(server,  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type"]
    }
  });

  server.listen(8081, () => {
    log.info(`socket listening on: ${8081}`);
  });

  return io;
}


module.exports = { connectSocket };
