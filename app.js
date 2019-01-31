//get local variables
const fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', {encoding: 'utf-8'}));

if(config.env == 'dev'){
  'use strict';
  require('greenlock-express').create({
    email: 'spence.bassman@gmail.com'     // The email address of the ACME user / hosting provider
  , agreeTos: true                    // You must accept the ToS as the host which handles the certs
  , configDir: '~/.config/acme/'      // Writable directory where certs will be saved
  , communityMember: false             // Join the community to get notified of important updates
  , telemetry: true                   // Contribute telemetry data to the project
  , servername: config.servername
  , approveDomains: config.approveDomains
  , debug: true
    // Using your express app:
    // simply export it as-is, then include it here
  , app: require('./server.js')
  }).listen(config.devOps.http,config.devOps.https);
}else{
  app = require('./server.js')
  app.listen(config.productionOps.port, () => console.log(`Veload started on port ${config.productionOps.port}!`))
}


