var express = require('express');
var cors = require('cors');
const path = require('path');
require('dotenv').config()
var multer  = require('multer');

var upload = multer({ dest: 'uploads/' });
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
var bodyParser = require('body-parser');
app.use (bodyParser.urlencoded({ extended: true }));

app.set('views',  path.join(process.cwd(), 'views'));
app.set("view engine", "pug");

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
    res.json({
    "name": req.file.originalname,
    "type": req.file.mimetype,
    "size": req.file.size
  })
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.send('500: Internal Server Error.');
});

app.use(function (req, res, next) {
  res.status(404);
  res.send('404: Page not found!');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});