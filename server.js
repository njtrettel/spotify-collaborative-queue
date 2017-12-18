const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const querystring = require('querystring');
const request = require('request');
const cookieParser = require('cookie-parser');

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
const redirectUri = 'http://localhost:1234/callback';
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
app.get('*', (req, res) => {
  const loggedIn = req.cookies ? req.cookies['accessToken'] : null;
  if (!loggedIn) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/public/dist/index.html');
  }
});

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
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
        redirect_uri: redirectUri,
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

server.listen(1234);
console.log('server running');
