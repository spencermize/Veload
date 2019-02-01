//get local variables
const fs = require('fs');
const configExists = fs.existsSync('config/config.json');
var config = "";
if(configExists){
  config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', {encoding: 'utf-8'}));
}

if(config.env == 'development'){
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
  }).listen(config.devOps.http,config.devOps.https);
}else{
  // On Google Cloud Platform authentication is handled for us
  const gcs = require('@google-cloud/storage')()

  const bucketName = `envvars.veload.bike`
  console.log(`Downloading config from bucket envars`)
  gcs
    .bucket(bucketName)
    .file('config.json')
    .download({ destination: 'config/config.json' })
    .then(() => {
      gcs
      .bucket(bucketName)
      .file('strava_config')
      .download({ destination: 'config/strava_config' })
      .then(() => {
        console.info('config downloaded successfully')
        config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', {encoding: 'utf-8'}));
        var app = require('./server.js')
        app.listen(config.productionOps.port, () => console.log(`Veload started on port ${config.productionOps.port}!`))  
      })    
    })
    .catch(e => {
      console.error(`config download: There was an error: ${JSON.stringify(e, undefined, 2)}`)
    })

}


