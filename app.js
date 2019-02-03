//set a global (:-() to determine app root
var path = require('path');
global.appRoot = path.resolve(__dirname);

//get local variables
const fs = require('fs');
const configExists = fs.existsSync('config/config.json');
var config = "";
if (configExists) {
  config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', { encoding: 'utf-8' }));
  loadStravaVars(config);
}

const spdy = require('spdy')

if (config.env == 'development') {
  'use strict';
  var greenlock = require('greenlock-express').create({
    email: config.devOps.email    // The email address of the ACME user / hosting provider
    , agreeTos: true                    // You must accept the ToS as the host which handles the certs
    , configDir: '~/.config/acme/'      // Writable directory where certs will be saved
    , communityMember: false             // Join the community to get notified of important updates
    , telemetry: true                   // Contribute telemetry data to the project
    , servername: config.devOps.servername
    , approveDomains: config.devOps.approveDomains
    , debug: true
  })
    ////////////////////////
    // http-01 Challenges //
    ////////////////////////

    // http-01 challenge happens over http/1.1, not http2
    var redirectHttps = require('redirect-https')();
    var acmeChallengeHandler = greenlock.middleware(redirectHttps);
    require('http').createServer(acmeChallengeHandler).listen(config.devOps.http, function () {
      console.log("Listening for ACME http-01 challenges on", this.address());
    });
    ////////////////////////
    // http2 via SPDY h2  //
    ////////////////////////

    // spdy is a drop-in replacement for the https API
    var spdyOptions = Object.assign({}, greenlock.tlsOptions);
    spdyOptions.spdy = { protocols: [ 'h2', 'http/1.1' ], plain: false };
    var app = require('./server.js');
    var server = require('spdy').createServer(spdyOptions, app);
    server.on('error', function (err) {
      console.error(err);
    });
    server.on('listening', function () {
      console.log("Listening for SPDY/http2/https requests on", this.address());
    });
    server.listen(config.devOps.https);
} else {
  
  
  // On Google Cloud Platform authentication is handled for us
  const { Storage } = require('@google-cloud/storage');
  const os = require('os');
  const storage = new Storage({
    projectId: 'veload',
  });

  const bucketName = `ennvars.veload.bike`;
  console.log(`Downloading config from bucket envars`);


  storage
    .bucket(bucketName)
    .file('config.json')
    .download({ destination: os.tmpdir() + '/config.json' })
    .then(() => {
          console.info('config downloaded successfully')
          config = JSON.parse(fs.readFileSync(os.tmpdir() + '/config.json', { encoding: 'utf-8' }));
          loadStravaVars(config)
          var app = require('./server.js')
          //is this crashing GAE?
          //spdy.createServer({},app).listen(process.env.PORT, () => console.log(`Veload started on port ${process.env.PORT}!`))

          app.listen(process.env.PORT, () => console.log(`Veload started on port ${process.env.PORT}!`))
    })
    .catch(e => {
      console.log(e);
      console.error(`config download: There was an error: ${JSON.stringify(e, undefined, 2)}`)
    })
  }

  function loadStravaVars(config){
    process.env.STRAVA_ACCESS_TOKEN = config.strava.access_token;
    process.env.STRAVA_CLIENT_ID = config.strava.client_id;
    process.env.STRAVA_CLIENT_SECRET = config.strava.client_secret;
    process.env.STRAVA_REDIRECT_URI = config.strava.redirect_uri;
  }