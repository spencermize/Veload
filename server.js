//command line parameters
const args = require('yargs').argv;

//various helpers
let moment = require('moment');
let hbs = require( 'express-handlebars');

//webapp
const express = require('express');
let session = require('express-session');
const https = require('https');
const fs = require('fs');
const homedir = require('os').homedir();
const app = express();
const axios = require('axios')
const client_id = "31578";
const client_secret = "8ed2b2f6bc292bbb2b1a322b10e9242c48fd3b49";


//db connections
const Sequelize = require('sequelize');
const sequelize = dbConnect();
const User = userModel(sequelize);
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const myStore = new SequelizeStore({
    db: sequelize
})
init(sequelize,args.reset);

// view engine setup
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: require('./config/hbs-helpers.js')
}));
console.log("startUp");
//serve from public folder
app.use(express.static('public',{index:false}));
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
	secret: 'craycray',
	resave: false,
	saveUninitialized: false,
	cookie: {

	},
	store: myStore
}));
myStore.sync();

// route for user Login
app.get('/login', sessionChecker,(req, res) => {
	showLogin(req,res);
})
app.route('/logout').get((req, res) => {
	req.session.destroy()
	res.redirect('/login');
});
// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
	console.log("home");
	res.redirect('/dashboard');
});
app.get('/dashboard',sessionChecker, (req, res) => {
	res.render('dashboard', {layout: 'default', modules: ['ride-info','speed-graph','goals']});
});	
app.get('/strava',(req, resp) => {
	let code = req.query.code;
	axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`,{}).then((res) =>{

	User.findOne({ where: { username: res.data.athlete.username } }).then(function (user) {
		if (!user) {
			console.log("no user");
			let user = User.create({
				username: res.data.athlete.username,
				access_token: res.data.access_token,
				refresh_token: res.data.refresh_token,
				expires_at: res.data.expires_at*1000
			}).then(function(user) {
				req.session.user = user.username;
				req.session.refresh_token = user.refresh_token;
				req.session.expires = user.expires_at;
				resp.redirect('/dashboard');
			})
		} else {
			console.log("user");
			reAuthStrava(req,resp,user.username);
		}
		}).catch((error) => {
			console.error(error)
		})
		
	});			
});

app.get('/api/:action/:id?',[sessionChecker,getStrava], function(req,res,next){
	let data = "";
	let strava = res.locals.strava;
	switch (req.params.action) {
		case 'athlete' : 
			strava.athlete.get(function(err,rs){
				res.json(rs);
			});
			break;
		case 'routes' :
			strava.routes.get(req.params.id,function(err,rs){
				res.json(rs);
			});
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
function reAuthStrava(req,resp,user){
	User.findOne({ where: { username: user } }).then(function (user) {
		console.log("" + user.username + " found...");
		axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${user.refresh_token}&grant_type=refresh_token`,{}).then((res) =>
		{
			user.access_token = res.data.access_token;
			user.refresh_token = res.data.refresh_token;
			user.expires_at = res.data.expires_at*1000;
	
			user.save().then(function(user){
				req.session.user = user.username;
				req.session.refresh_token = user.refresh_token;
				req.session.expires = user.expires_at;
				
				console.log("heading to dash");
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
function getStrava(req,res,next){
	User.findOne({ where: { refresh_token: req.session.refresh_token, username: req.session.user } }).then(function (user) {
		let strava = new require("./custom/strava")({
			client_id: client_id,	
			client_secret: client_secret,
			access_token: user.access_token
		});
		res.locals.strava = strava;
		next()
	});
}
function showLogin(req,res){
	res.render('login', {layout: 'default', url: req.protocol + '://' + req.hostname});
}
function init(sequelize,reset){
	sequelize.sync({ force: reset }).then(function(err) {
	}, function (err) { 
		console.log('An error occurred while starting:', err);
	});
}
// middleware function to check for logged-in users
function sessionChecker(req, res, next){
	console.log("session check");
	console.log(req.session.user +" : "+req.session.expires);
	if (req.session.user && moment(req.session.expires).isAfter(moment())) {
		console.log("Found user with valid credential");
		if(req.url == "/login"){
			res.redirect("/dashboard");
		}else{
			next();
		}
	} else if(req.session.user && moment(req.session.expires).isBefore(moment())){
		console.log("Found user with expired credential");
		reAuthStrava(req, res, req.session.user);
		next();
	}else {
		console.log("Could not find user or session");
		if(req.url != "/login"){
			console.log("redirecting to login");
			res.redirect('/login');
		}else{
			showLogin(req,res);
		}
	}    
};
module.exports = app;
