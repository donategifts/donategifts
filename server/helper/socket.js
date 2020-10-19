const fs = require('fs');

const https = require('https');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/dev.donate-gifts.com/cert.pem')
};
var server = https.createServer(options);
var io  = require('socket.io')(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
var port = 3000; // Enter any of the cloudflare ports.


server.listen(port, function(){
  console.log('listening : ' + port);
});

module.exports = io
