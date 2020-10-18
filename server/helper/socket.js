const io = require('socket.io')(3000);
io.set('origins', '*:*');

module.exports = io
