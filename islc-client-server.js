var express = require('express'),
  fs = require('fs'),
  AWS = require('aws-sdk'),
  S3 = new AWS.S3(),
  app = express(),
  request = require('superagent'),
  environment = process.env.NODE_ENV || 'development',
  privateBucket = process.env.AMAZON_PRIVATE_BUCKET,
  angularEnvVars = {
    development: {
      env: 'dev',
      root: '/app',
      islc: 'https://calligraphy.quiver.is',
      api: 'https://calligraphy.quiver.is/api'
    },
    production: {
      env: 'prod',
      root: '/app',
      islc: 'http://istilllovecalligraphy.com',
      api: 'http://istilllovecalligraphy.com/api'
    }
  },
  fileRoot = __dirname + angularEnvVars[environment].root;

AWS.config.update({accessKeyId: process.env.AMAZON_ACCESS_KEY_ID, secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY});

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
//  console.log('url', req.url);
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

app.get('/aws', function (req, res) {
  var path,
    parts;

  if (req.param('path')) {
    path = req.param('path');
    parts = path.split('.');
    res.setHeader('Content-Type', 'image/' + parts[parts.length-1]);
    S3.getSignedUrl('getObject', {Bucket: privateBucket, Key: req.param('path')}, function (err, url) {
      request.get(url)
        .set('X-NO-STREAM', true)
        .set('connection', 'keep-alive')
        .set('Accept-Encoding', 'gzip,deflate,sdch')
        .set('Accept', 'text/javascript, text/html, application/xml, text/xml, */*')
        .parse(function (response) {
          response.image = '';
          response.setEncoding('binary');
          response.on('data', function (data) {
            response.image += data;
          });
          response.on('end', function () {
            res.send(new Buffer(response.image, 'binary'));
          });
        })
        .end(function (err, res) {
          //Don't do jack... the callback is handled in the parse
        });
    });
  } else {
    res.send(404);
  }

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

