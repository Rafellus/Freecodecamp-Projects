require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const app = express();
let shortUrlList = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded( {extended: false}) );

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoints
app.get('/api/shorturl/:id', function (req, res) {
  for (let i = 0; i < shortUrlList.length; i++) {
    console.log("*** GET *** Loop:", i)
    console.log("short_url:", shortUrlList[i].short_url)

    if ( shortUrlList[i].short_url === req.params.id ) {
      console.log("redirect")
      return res.redirect(shortUrlList[i].original_url);
    }
  }
  res.json({ error: 'invalid url' });
});

app.post('/api/shorturl', function(req, res) {
  const original_url = req.body.url;
  let short_url = shortUrlList.find(x => x.original_url === original_url);

  if ( short_url) {
    console.log('Already Stored:', original_url);
    res.json( { original_url, short_url});

  } else if ( isValidUrl(original_url)) {
    short_url = idGen();
    shortUrlList.push({ original_url, short_url});
    console.log('response:', { original_url, short_url});
    res.json({ original_url, short_url});

  } else {
    console.log('invalid url:', original_url);
    res.json({ error: 'invalid url' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


// Utility
const idGen = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 6 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 6);
};

const isValidUrl = (url) => {
  let validUrl = true;
  const hasProtocol = (x) => new RegExp("^http(s)?:\/\/","ig").test(x);

  dns.lookup(url, error => {
    if (error && error.code === 'ENOTFOUND') { validUrl = false; }
  });

  return validUrl && hasProtocol(url)? true : false;
}