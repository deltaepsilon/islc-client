require('newrelic');
var Q = require('q'),
  _ = require('underscore'),
  express = require('express'),
  fs = require('fs'),
  AWS = require('aws-sdk'),
  S3 = new AWS.S3(),
  moment = require('moment'),
  Firebase = require('firebase'),
  Mandrill = require('mandrill-api/mandrill').Mandrill,
  mandrill = new Mandrill(process.env.MANDRILL_API_KEY),
  CronJob = require('cron').CronJob,
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
      firebase: 'dev-quiver.firebaseIO.com',
      email: {
        from: 'chris@quiver.is',
        name: 'Chris Esplin'
      }
    },
    production: {
      env: 'prod',
      root: '/app',
      islc: 'https://istilllovecalligraphy.com',
      api: 'https://istilllovecalligraphy.com/api',
      firebase: 'quiver.firebaseIO.com',
      email: {
        from: 'melissa@istilllovecalligraphy.com',
        name: 'Melissa Esplin'
      }
    }
  },
  fileRoot = __dirname + angularEnvVars[environment].root,
  firebaseRoot = new Firebase(angularEnvVars[environment].firebase),
  firebaseSecret = process.env.QUIVER_INVOICE_FIREBASE_SECRET;

firebaseRoot.auth(firebaseSecret);

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
      var i = data.Contents.length,
        promises = [],
        deferred,
        getMetadata = function (i, deferred) {
          S3.headObject({
            Bucket: publicBucket,
            Key: data.Contents[i].Key
          }, function (err, metadata) {
            if (err) {
              deferred.reject(err);
            } else {
              data.Contents[i].Metadata = metadata.Metadata;
              deferred.resolve(data.Contents[i]);
            }
          });
          return deferred.promise;

        };

      while (i--) {
        deferred = Q.defer();
        promises.push(getMetadata(i, deferred));
      }

      Q.all(promises).then(function () {
        res.json(data);
      });

    }

  });
});

// Update header
app.post('/image/:fileName/metadata', function (req, res) {
  var fileName = req.params.fileName,
    metadata = {},
    keys = Object.keys(req.body),
    i = keys.length;

  while (i--) { // I'm not sure why I'm looping through this... seems like the right thing to do???
    metadata[keys[i]] = req.body[keys[i]];
  }


  // Copy object with whatever headers have been specified.

  var payload = {
      Bucket: publicBucket,
      CopySource: publicBucket + '/' + fileName,
      Key: fileName,
      ACL: 'public-read',
      CacheControl: "max-age=34536000",
      StorageClass: "REDUCED_REDUNDANCY",
      Metadata: metadata,
      MetadataDirective: "REPLACE"
    };

  S3.copyObject(payload, function (err, data) {
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

var sendEmail = function (email, key) {
  var deferred = Q.defer(),
    payload = {
      message: {
        text: email.body,
        subject: email.subject,
        from_email: email.from || angularEnvVars[environment].email.from,
        from_name: email.name || angularEnvVars[environment].email.name,
        to: [],
        headers: {
          "Reply-To": email.from || angularEnvVars[environment].email.from
        },
        bcc_address: angularEnvVars[environment].email.from
      }
    },
    to = email.to.split(','),
    cc = email.cc ? email.cc.split(',') : [],
    bcc = email.bcc ? email.bcc.split(',') : [],
    addAddresses = function (list, type) {
      var i = list.length;
      while (i--) {
        payload.message.to.push({type: type, email: list[i].trim()});
      }
    };

  addAddresses(to, 'to');
  addAddresses(cc, 'cc');
  addAddresses(bcc, 'bcc');

  mandrill.messages.send(payload, function (data) {
    deferred.resolve({result: data, key: key});
  }, function (err) {
    deferred.reject({result: err, key: key});
  });

  return deferred.promise;
};

var sendJob = function () {
    var queueRef = new Firebase(angularEnvVars[environment].firebase + '/islc/email/queue'),
      queueDeferred = Q.defer(),
      daysRef = firebaseRoot.child('islc').child('email').child('days'),
      daysDeferred = Q.defer(),
      deferreds = [];

    queueRef.auth(firebaseSecret);

    queueRef.once('value', function (queueSnapshot) {
      queueDeferred.resolve(queueSnapshot.val());
    });

    daysRef.once('value', function (daysSnapshot) {
      daysDeferred.resolve(daysSnapshot.val());
    });

    Q.all([queueDeferred.promise, daysDeferred.promise]).spread(function (queue, days) {
      var deferred = Q.defer(),
        today = moment(),
        sendFlag = days[today.isoWeekday()];


      _.each(queue, function (email, key, list) {

        // Send email if it's a sending day or if the send date has passed.
        console.log('queue', queue);
        if ((!email.date && sendFlag) || (moment(email.date).unix() < today.unix())) {
          deferreds.push(sendEmail(email, key));
        }
      });

      Q.all(deferreds).then(deferred.resolve);

      return deferred.promise;
    }).then(function (emailResults) {
        _.each(emailResults, function (data) {
          console.log('Sent: ', data.result[0]);
          if (data.result[0].status === 'sent') {
            firebaseRoot.child('islc').child('email').child('queue').child(data.key).remove();
          }

        });
    });


  },
  cron = new CronJob('00 00 * * * *', sendJob, function () {
      console.log('cron job complete', arguments);
    });

console.log('starting email cron');
cron.start();


app.post('/email/:key', function (req, res) {
  var key = req.params.key,
    emailRef = new Firebase(angularEnvVars[environment].firebase + '/islc/email/queue/' + key),
    emailDeferred = Q.defer(),
    errorHandler = function (err) {
      res.send(500, err);
    };

  emailRef.auth(firebaseSecret);

  emailRef.once('value', function (emailSnapshot) {
    emailDeferred.resolve(emailSnapshot.val());
  });

  emailDeferred.promise.then(function (email) {
    sendEmail(email, key);
  }).then(function (data) {
    var deferred = Q.defer();

    emailRef.remove(function (err) {
      deferred.resolve({email: data, remove: err || true});
    });

    return deferred.promise;
  }).then(res.json, errorHandler);

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
app.get('/email', returnIndex);

/**
 * Serve static files
*/
app.use(express.static(fileRoot));

app.listen(9300);

