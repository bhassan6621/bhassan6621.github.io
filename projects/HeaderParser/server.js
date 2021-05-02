// server.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var requestIp = require('request-ip');
var ipMiddleware = (req, res, next) => {
  var clientIp = requestIp.getClientIp(req);
  next();
}
app.use(requestIp.mw());


app.get("/api/whoami", function(req, res) {
  var ipaddress = req.clientIp;
  var language = req.acceptsLanguages();
  var software = req.get("User-Agent");
  res.json({
    ipaddress: ipaddress,
    language: language[0],
    software: software
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
