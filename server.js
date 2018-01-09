const https = require('https');
const express = require('express');
const app = express();
const querystring = require('querystring');
const request = require('request');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const config = require('./config');
const bodyParser = require('body-parser');

const key = fs.readFileSync('ssl/private.key');
const cert = fs.readFileSync('ssl/certificate.crt');

const options = {
  key: key,
  cert: cert
};

const server = https.createServer(options, app);

const { clientId, clientSecret } = require('./secrets');

const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';
const authRedirectUri = config.getAuthRedirectUri();
const scope =  'user-read-private \
user-read-email \
user-read-birthdate \
playlist-read-private \
playlist-modify-private \
playlist-modify-public \
playlist-read-collaborative \
user-top-read \
user-read-recently-played \
user-library-read \
user-library-modify \
user-read-currently-playing \
user-modify-playback-state \
user-read-playback-state \
user-follow-modify \
user-follow-read \
streaming';

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: authRedirectUri,
      state: state
    }));
});

app.get('/callback', (req, res) => {
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  const code = req.query.code;

  if (state === null || state !== storedState) {
    res.status(400).send('Error: mismatched states');
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: authRedirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;
        res.cookie('accessToken', accessToken);
        res.cookie('refreshToken', refreshToken);
        res.redirect('/');
      } else {
        console.log(error);
        res.status(400).send('error');
      }
    });
  }
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  };

  const referrer = req.get('Referrer');
  request.post(authOptions, function(error, response, body) {
    if (!error) {
      const accessToken = body.access_token;
      res.cookie('accessToken', accessToken);
      res.status(200).send(referrer);
    } else {
      console.log(error);
      res.status(400).send('error');
    }
  });
});

app.get('*', (req, res) => {
  const loggedIn = req.cookies ? req.cookies['accessToken'] : null;
  if (!loggedIn) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/public/dist/index.html');
  }
});


server.listen(443);
console.log('server running');
