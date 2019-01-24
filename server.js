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

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
app.set('views',  __dirname + '/public/views/');
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/public/views/layouts/',
  partialsDir: __dirname + '/public/views/partials/',
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
	res.render('dashboard', {layout: 'default', modules: ['rideInfo','speedGraph','goals','maps']});
});	
app.get('/strava',(req, resp, next) => {
	let code = req.query.code;
	let strava = require('strava-v3');
	strava.oauth.getToken(code,function(err,res,limits){
		User.findOne({ where: { username: res.athlete.username } }).then(function (user) {
		if (!user) {
			console.log("no user");
			let user = User.create({
				username: res.athlete.username,
				access_token: res.access_token,
				refresh_token: res.refresh_token,
				expires_at: res.expires_at*1000
			}).then(function(user) {
				req.session.user = user.username;
				req.session.refresh_token = user.refresh_token;
				req.session.expires = user.expires_at;
				let strava = getStrava(req,resp.next);
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
app.get('/icons/:img',function(req,res,next){
	let img = req.params.img;
	let fa_name = req.params.img.replace(".svg","");
	let color = req.query.color || "";
	img = img.replace(".","_" + color + ".");
	let path = 'public/img/icons/';	
	if (!fs.existsSync(path+img)) {
		console.log("creating new icon...");
		const fa = require('font-awesome-assets');
		const out = fa.svg(fa_name, "#" + color);
		fs.writeFileSync(path + img, out, 'utf8');
	}
	fs.readFile(path+img,function(err,r){
		res.set('Content-Type', 'image/svg+xml');
		res.send(r);
	});
});
app.get('/api/:action/:id([0-9]{0,})?/:sub([a-zA-Z]{0,})?',[sessionChecker,getStrava], function(req,res,next){
	let data = "";
	let strava = res.locals.strava;
	let p = {'access_token':res.locals.token};
	if(req.params.id){
		p = Object.assign({id:req.params.id},p)
	}
	switch (req.params.action) {
		case 'user':
			if(req.params.sub=="layout"){
				User.findOne({ where: { username: req.session.user } }).then(function (user) {
					res.json(user.layout);
				});
			}
			break;
		case 'athlete':
		case 'activities':
		case 'routes':
		case 'segments':
			if(req.params.sub){
				var list = "list"+capitalizeFirstLetter(req.params.sub);
				strava[req.params.action][list](p,function(err,rs,limits){
					res.json(rs);
				})
			}else{
				strava[req.params.action].get(p,function(err,rs,limits){
					res.json(rs);
				});				
			}
			break;
		case 'routesGPX' :
			p.id = p.id + "/export_gpx";
			strava.routes.get(p,function(err,rs){
				if(req.query.format=="json"){
					const gps = require('gps-util');
					req.query.format = null;
					gps.gpxParse(rs,function(err,results){
						res.json(results);	
					});
				}else{
					console.log(rs);
					res.send(rs);
				}
			});					
			break;
		case 'activitiesGPX' : 
			p.types = ["latlng","altitude","time"];
			const createGpx = require('gps-to-gpx').default;
			strava.streams.activity(p,function(err,rs){
				var types = {};
				var reso = [];
				for( var dat in rs){
					var type = rs[dat].type
					types[type] = rs[dat].data;
				};
				for( var dat in types.latlng){
					reso.push({
						"latitude": types.latlng[dat][0],
						"longitude": types.latlng[dat][1],
						"elevation": types.altitude[dat],
						"time": types.time[dat]
					})
				}
				p.per_page = 999
				strava.activities.get(p,function(err,rs){
					const ops = {
						"activityName" : rs.name
					}
					const gpx = createGpx(reso,ops);
					res.send(gpx)
				});
			});
			break;
		default:
			data = {"status" : "error", "msg":"User not found"};
			data = {"status" : "error", "msg":"Sorry, operation unsupported"};
			res.json(data);
			break;
	}
});
app.post('/api/:action/:sub([a-zA-Z]{0,})?',[sessionChecker,getStrava],function(req,res,next){
	let strava = res.locals.strava;
	switch (req.params.action) {
		case 'publish' :
			let distance = req.query.distance * 1609.34;
			strava.activities.create({
					access_token: res.locals.token,
					name: "Veload Session",
					type: "ride",
					start_date_local: req.query.start,
					trainer: true,
					elapsed_time: req.query.elapsed,
					distance: distance
				},function(err,rs){
					res.json(rs);
			});
			break;
		case 'user':
			switch(req.params.sub){
				case 'layout' : 				
					User.findOne({ where: { username: req.session.user } }).then(function (user) {
						console.log(req.body.layout);
						user.layout = req.body.layout;
						user.save().then(function(user){
							data = {"status" : "success"}
							res.json(data);
						});
					}).error(function(){
						data = {"status" : "error", "msg":"User not found"};
						res.json(data);
					});
					break;
				default : 
					data = {"error":"Sorry, operation unsupported"};
					res.json(data);	
					break;
			}
			break;
		default : 
			data = {"error":"Sorry, operation unsupported"};
			res.json(data);	
			break;
	}
});
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function reAuthStrava(req,resp,user){
	User.findOne({ where: { username: user } }).then(function (user) {
		console.log("" + user.username + " found...");
		let strava = require("strava-v3");
		var configPath = 'config/strava_config';
		var config = fs.readFileSync(configPath, {encoding: 'utf-8'});
		config = JSON.parse(config);
		axios.post(`https://www.strava.com/oauth/token?client_id=${config.client_id}&client_secret=${config.client_secret}&refresh_token=${user.refresh_token}&grant_type=refresh_token`,{}).then((res) =>
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
		expires_at: Sequelize.DATE,
		layout: Sequelize.JSON
	});
	return User;
}
function getStrava(req,res,next){
	User.findOne({ where: { refresh_token: req.session.refresh_token, username: req.session.user } }).then(function (user) {
		let strava = require("strava-v3");
		res.locals.strava = strava;
		res.locals.token = user.access_token;
		next()
	});
}
function showLogin(req,res){
	let strava = require("strava-v3");
	let url = strava.oauth.getRequestAccessURL({scope:"activity:write,read,read_all,activity:read_all"});
	res.render('login', {layout: 'default', url: url});
}
function init(sequelize,reset,alter=true){
	sequelize.sync({ force: reset, alter: alter }).then(function(err) {
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
