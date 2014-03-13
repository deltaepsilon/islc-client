require('newrelic');
var express = require('express'),
  fs = require('fs'),
  AWS = require('aws-sdk'),
  S3 = new AWS.S3(),
  moment = require('moment'),
  app = express(),
  request = require('superagent'),
  environment = process.env.NODE_ENV || 'development',
  privateBucket = process.env.AMAZON_PRIVATE_BUCKET,
  publicBucket = process.env.AMAZON_PUBLIC_BUCKET,
  clientPrefix = 'calligraphy/client',
  angularEnvVars = {
    development: {
      env: 'dev',
      root: '/app',
      islc: 'https://calligraphy.quiver.is',
      api: 'https://calligraphy.quiver.is/api',
      firebase: 'dev-quiver.firebaseIO.com'
    },
    production: {
      env: 'prod',
      root: '/app',
      islc: 'https://istilllovecalligraphy.com',
      api: 'https://istilllovecalligraphy.com/api',
      firebase: 'quiver.firebaseIO.com'
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

  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']); // Allow whatever they're asking for

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

// Read files from s3 bucket.
app.get('/image', function (req, res) {
  S3.listObjects({
      Bucket: publicBucket,
      Prefix: clientPrefix
    },
  function (err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }

  });
});

// Add file to s3 bucket.
app.post('/image/:fileName', function (req, res) {


  var fileName = req.params.fileName,
    dataUrl = req.body.file,
    matches = dataUrl.match(/^data:.+\/(.+);base64,(.*)$/);

  if (!matches) {
    return res.send(500, {"error": "No file sent."});
  }

  var extension = matches[1],
    file = new Buffer(matches[2], "base64"),
    type = req.body.type,
    payload = {
      Bucket: publicBucket,
      Key: clientPrefix + '/' + fileName,
      ACL: 'public-read',
      Body: file,
      CacheControl: "max-age=34536000",
      ContentType: type,
      StorageClass: "REDUCED_REDUNDANCY"
    };

  S3.putObject(payload, function (err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }

  });

});

app.del('/image/:fileName', function (req, res) {
  var fileName = req.params.fileName;

  S3.deleteObjects({
    Bucket: publicBucket,
    Delete: {
      Objects: [{
        Key: fileName
      }]

    }

  }, function (err, data) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(data);
    }
  });
});


/**
 * Set up Angular routes to return index.html
*/
var returnIndex = function (req, res) {
  var ENV_VARS_REGEX = /{{ envVars }}/,
    env = angularEnvVars[environment];

    if (req.session.access_token) { // Tack on the access_token for good luck.
      env.access_token = req.session.access_token;
      env.authorization = 'Bearer ' + env.access_token;
    };

    fs.readFile(fileRoot + '/index.html', {encoding: 'utf8'}, function (err, data) {
      data = data.replace(ENV_VARS_REGEX, 'window.envVars = ' + JSON.stringify(env) + ';');
      res.send(data);
    });
  };

app.get('/', returnIndex);
app.get('/index.html', returnIndex);
app.get('/galleries', returnIndex);
app.get('/comments', returnIndex);
app.get('/discounts', returnIndex);
app.get('/transactions', returnIndex);
app.get('/files', returnIndex);
app.get('/announcements', returnIndex);
app.get('/images', returnIndex);

/**
 * Serve static files
*/
app.use(express.static(fileRoot));

app.listen(9300);

