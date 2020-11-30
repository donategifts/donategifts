const http = require('http');
const log = require('./logger');

let io;
function connectSocket(app) {
  const server = http.createServer(app);

  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  });

  server.listen(8081, () => {
    log.info(`socket listening on: ${8081}`);
  });

  return io;
}

module.exports = { connectSocket };
