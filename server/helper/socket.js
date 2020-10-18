const io = require('socket.io')();

io.set('origins', '*:*');

module.exports = io
