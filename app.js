//get local variables
const fs = require('fs');
const configExists = fs.existsSync('config/config.json');
var config = "";
if (configExists) {
  config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', { encoding: 'utf-8' }));
  loadStravaVars(config);
}

if (config.env == 'development') {
  'use strict';
  require('greenlock-express').create({
    email: config.devOps.email    // The email address of the ACME user / hosting provider
    , agreeTos: true                    // You must accept the ToS as the host which handles the certs
    , configDir: '~/.config/acme/'      // Writable directory where certs will be saved
    , communityMember: false             // Join the community to get notified of important updates
    , telemetry: true                   // Contribute telemetry data to the project
    , servername: config.devOps.servername
    , approveDomains: config.devOps.approveDomains
    , debug: true
    // Using your express app:
    // simply export it as-is, then include it here
    , app: require('./server.js')
  }).listen(config.devOps.http, config.devOps.https);
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