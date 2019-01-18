'use strict';

require('greenlock-express').create({
  email: 'spence.bassman@gmail.com'     // The email address of the ACME user / hosting provider
, agreeTos: true                    // You must accept the ToS as the host which handles the certs
, configDir: '~/.config/acme/'      // Writable directory where certs will be saved
, communityMember: false             // Join the community to get notified of important updates
, telemetry: true                   // Contribute telemetry data to the project
, servername: 'home.spencerm.pro'
, approveDomains: ['home.spencerm.pro','sjmize.duckdns.org']
, debug: true
  // Using your express app:
  // simply export it as-is, then include it here
, app: require('./server.js')
}).listen(80,443);