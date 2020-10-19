const fs = require('fs');

const https = require('https');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/wsdev.donate-gifts.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/wsdev.donate-gifts.com/cert.pem')
};
var server = https.createServer(options);
var io  = require('socket.io').listen(server);
var port = 3000; // Enter any of the cloudflare ports.


server.listen(port, function(){
  console.log('listening : ' + port);
});

module.exports = io
