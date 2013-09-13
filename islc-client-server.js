var express = require('express'),
  fs = require('fs'),
  app = express(),
  environment = process.env.NODE_ENV || 'development',
  angularEnvVars = {
    development: {
      env: 'dev',
      islc: 'https://calligraphy.quiver.is',
      api: 'https://calligraphy.quiver.is/api'
    },
    production: {
      env: 'prod',
      islc: 'http://istilllovecalligraphy.com',
      api: 'http://istilllovecalligraphy.com/api'
    }
  },
  fileRoot;

if (environment === 'development') {
  fileRoot = __dirname + '/app';
} else {
  fileRoot = __dirname + '/dist';
}

/**
 * Express Middleware!
 */
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'awjklqw34kljaerwtjkladsf234adsfjkladsklaewrjlaerwkladfs'}));

/**
 * Access Tokens
 */
app.get('*',function (req, res, next) {
  if (req.param('access_token')) {
    req.session.access_token = req.param('access_token');
  }
  next();
});

/**
 * Endpoints
*/
app.get('/env', function (req, res) {
  var env = angularEnvVars[environment];

  if (req.session.access_token) { // Tack on the access_token for good luck.
    env.access_token = req.session.access_token;
    env.authorization = 'Bearer ' + env.access_token;
  }

  res.json(env);
});


/**
 * Set up Angular routes to return index.html
*/
var returnIndex = function (req, res) {
    fs.readFile(fileRoot + '/index.html', {encoding: 'utf8'}, function (err, data) {
      res.send(data);
    });
  };

app.get('/galleries', returnIndex);
app.get('/comments', returnIndex);

/**
 * Serve static files
*/
app.use(express.static(fileRoot));

app.listen(9300);

