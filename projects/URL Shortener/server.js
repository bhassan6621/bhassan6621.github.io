var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();
const dns = require("dns");
// Basic Configuration
var port = process.env.PORT || 3000;

const mySecret = process.env['MONGO_URI']

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(mySecret, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 
});

const urlSchema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: Number, required: true}
});
const Url = mongoose.model("Url", urlSchema);


app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let maxShortUrl = 0;

const shortUrlUpdater = function() {
  Url
    .find()
    .lean()
    .sort( {short_url: -1} )
    .limit(1)
    .exec(function(err, data) {
      if (err) return console.log("Error:", err);
      if (data.length > 0) {
        maxShortUrl = data[0].short_url;
      }
  });  
};

app.post("/api/shorturl", (req, res) => {

  shortUrlUpdater();
  let reqUrl = req.body.url;
  let protocol = reqUrl.substring(0, reqUrl.indexOf("://") + 3);
  let urlWithSubdir = reqUrl.substring(protocol.length);
  let hostName = "";    
  if (urlWithSubdir.indexOf("/") >= 0) {
    hostName = urlWithSubdir.substring(0, urlWithSubdir.indexOf("/"));
  }
  else {
    hostName = urlWithSubdir;
  };
  if (protocol != "http://" && protocol != "https://") {
    return res.json( {"error": "invalid URL"} );
  };
  
  dns.lookup(hostName, function(err, address) {
    if (err) {
      return res.json( {"error": "invalid hostname"} )
    }
    else {
      Url.findOne( {"original_url": reqUrl}, function(err, data) {
        if (err) return console.log("Error querying the database for reqUrl:", err);

        if (data) {
          return res.json({
            "original_url": reqUrl,
            "short_url": data.short_url
          });
        }

        else {
          let newEntry = new Url({
            "original_url": reqUrl,
            "short_url": maxShortUrl + 1
          });      
          newEntry.save(function(err, data) {
            if (err) return console.log("Error:", err);
            
            return res.json({
              "original_url": reqUrl,
              "short_url": maxShortUrl + 1
            });
          });

        }; 
      }) 
    }  
  }); 
});

app.get("/api/shorturl/:short_url", (req, res) => { 
  let shortUrl = req.params.short_url;
  if ( isNaN( +shortUrl ) ) {
    res.status(404);
  }
  else {
    Url
      .findOne( {"short_url": shortUrl}, function(err, data) {
        if (err) return console.log("Error:", err);   
        if (data) {
          res.redirect(data.original_url);
        }
        else {
          res.status(404);
        }
    });
    
  }
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});