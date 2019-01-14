//command line parameters
const args = require('yargs').argv;

//various helpers
let moment = require('moment');
let hbs = require( 'express-handlebars');

//db connections
const Sequelize = require('sequelize');
const sequelize = dbConnect();
const User = userModel(sequelize);
init(sequelize,args.reset);


//webapp
const express = require('express');
let session = require('express-session');
const https = require('https');
const fs = require('fs');
const homedir = require('os').homedir();
const app = express();
const axios = require('axios')
const port = 3000;
const client_id = "31578";
const client_secret = "8ed2b2f6bc292bbb2b1a322b10e9242c48fd3b49";

// view engine setup
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

function startUp(){
	//serve from public folder
	app.use(express.static('public',{index:false}));

	// initialize express-session to allow us track the logged-in user across sessions.
	app.use(session({
		secret: 'craycray',
		resave: false,
		saveUninitialized: false,
		cookie: {

		}
	}));

	// middleware function to check for logged-in users
	var sessionChecker = (req, res, next) => {
		if (req.session.user && moment(req.session.expires).isAfter(moment())) {
			console.log("Found user with valid credential");
			next();
		} else if(req.session.user && moment(req.session.expires).isBefore(moment())){
			console.log("Found user with expired credential");
			reAuthStrava(req, res, req.session.user);
		}else {
			console.log("Could not find user or session");
			res.redirect('/login');
		}    
	};
	// route for user Login
	app.route('/login').get((req, res) => {
		res.render('login', {layout: 'default'});
    })

	// route for Home-Page
	app.get('/', sessionChecker, (req, res) => {
		res.redirect('/dashboard');
	});
	app.get('/dashboard',sessionChecker, (req, res) => {
		res.render('dashboard', {layout: 'default'});
	});	
	app.get('/strava',(req, resp) => {
		let code = req.query.code;
		axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`,{}).then((res) =>{

		User.findOne({ where: { username: res.data.athlete.username } }).then(function (user) {
            if (!user) {
                let user = User.create({
					username: res.data.athlete.username,
					access_token: res.data.access_token,
					refresh_token: res.data.refresh_token,
					expires_at: res.data.expires_at*1000
				}).then(function(user) {
					req.session.user = user.username;
					req.session.expires = user.expires_at;
					resp.redirect('/dashboard');
				})
			} else {
				reAuthStrava(req,resp,user.username);
            }
			}).catch((error) => {
				console.error(error)
			})
            
        });			
	});

	app.get('/api/:action',sessionChecker, function(req,res,next){
		let data = "";
		switch (req.params.action) {
			case 'athlete' : 
				User.findOne({ where: { refresh_token: req.session.refresh_token, username: req.session.user } }).then(function (user) {
					let strava = new require("strava")({
						client_id: client_id,	
						client_secret: client_secret,
						access_token: user.access_token
					});
					strava.athlete.get(function(err,rs){
						res.json(rs);
					});
				})
				break;
			default:
				data = {"error":"Sorry, operation unsupported"};
				res.json(data);
				break;
		}
	});
	app.post('/api/:action',function(req,res,next){
		switch (req.params.action) {
			case 'publish' :
				User.findOne({ where: { refresh_token: req.session.refresh_token, username: req.session.user } }).then(function (user) {
					let strava = new require("strava")({
						client_id: client_id,	
						client_secret: client_secret,
						access_token: user.access_token
					});
					console.log(req.query.distance);
					let distance = req.query.distance * 1609.34;
					strava.activities.create({
							name: "Veload Session",
							type: "ride",
							start_date_local: req.query.start,
							trainer: true,
							elapsed_time: req.query.elapsed,
							distance: distance
						},function(err,rs){
							res.json(rs);
					});
				})	
				break;
			default:
				data = "Sorry, operation unsupported";
				break;
		}
	});
	https.createServer({
		key: fs.readFileSync(homedir + '/server.key'),
		cert: fs.readFileSync(homedir + '/server.cert')
	}, app)
	.listen(port, () => {
	  console.log(`Server listenening on ${port}`);
	});
	
}
function reAuthStrava(req,resp,user){
	User.findOne({ where: { username: user } }).then(function (user) {
		console.log("" + user.username + " found...");
		axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${user.refresh_token}&grant_type=refresh_token`,{}).then((res) =>
		{
			user.access_token = res.data.access_token;
			user.refresh_token = res.data.refresh_token;
			user.expires_at = res.data.expires_at*1000;
			req.session.user = user.username;
			req.session.refresh_token = user.refresh_token;
			req.session.expires = user.expires_at;			
			user.save().then(function(){
				resp.redirect("/dashboard");
			});
		}).catch((error) => {
			console.error(error)
		});
	}).catch((error) => {
		console.error(error)
	});
}
function dbConnect(){
	return new Sequelize('veload', 'veload', 'y0OT1*jtd3G1VH$x', {
		host: '35.224.151.186',
		dialect: 'mysql',
		operatorsAliases: false,

		pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
		}
	});
}

function userModel(sequelize){
	var User = sequelize.define('User', {
		username: Sequelize.STRING,
		access_token: Sequelize.STRING,
		refresh_token: Sequelize.STRING,
		expires_at: Sequelize.DATE
	});
	return User;
}

function init(sequelize,reset){
	sequelize.sync({ force: reset }).then(function(err) {
		startUp();
	}, function (err) { 
		console.log('An error occurred while starting:', err);
	});
}