require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};

app.post('/api/shorturl', (req, res) => {
  const { url: original_url } = req.body;
  const short_url = Math.floor(Math.random() * 100);
  const urlRegex = /^(http|https):\/\//;

  if (!urlRegex.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  urlDatabase[short_url] = original_url;
  return res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const original_url = urlDatabase[req.params.short_url];

  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
