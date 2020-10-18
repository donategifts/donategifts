const io = require('socket.io').listen(3000);

io.set('origins', '*:*');

module.exports = io
