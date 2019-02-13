//command line parameters
const args = require('yargs').argv;

//get local variables
const fs = require('fs');
const os = require('os');
var config;
if(fs.existsSync('config/config.json')){
	config = JSON.parse(fs.readFileSync(__dirname + '/config/config.json', {encoding: 'utf-8'}));
}else if(fs.existsSync(os.tmpdir() + '/config.json')){
	config = JSON.parse(fs.readFileSync(os.tmpdir() + '/config.json', {encoding: 'utf-8'}));
}
global.config = config;
//various helpers
let moment = require('moment');
let hbs = require('express-hbs');
let _ = require('lodash');
global.hbs = hbs;
require('./src/js/modules/HbsHelpers.js');

//webapp
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const responseTime = require('response-time');
const session = require('express-session');
const app = express();

app.use(responseTime());
app.use(favicon(appRoot + '/public/favicon.ico'))

if(config.env !== "development"){
	// include and initialize the rollbar library with your access token
	var Rollbar = require("rollbar");
	var rollbar = new Rollbar({
		accessToken: config.rollbar,
		environment: config.env,
		captureUncaught: true,
		captureUnhandledRejections: true
	});	
	app.use(rollbar.errorHandler());
}


// record a generic message and send it to Rollbar
if(config.env=="production"){
	rollbar.log("veload startup initiated");
}

//communicate with Strave & other APIs
const axios = require('axios')

//get post variables
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit:500000})); // support encoded bodies

//be nice to bandwidth
app.use(compression())

//db connections
const Sequelize = require('sequelize');
const sequelize = dbConnect();
const User = userModel(sequelize);
const WorkoutTemplate = workoutTemplateModel(sequelize);
buildAssociations();
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const myStore = new SequelizeStore({
    db: sequelize
})
init(sequelize,args.reset);

const modules = ['rideInfo','speedGraph','maps','cadenceGraph','heartrateGraph','customChart'];
// view engine setup
app.set('view engine', 'hbs');
app.set('views',  __dirname + '/public/views/');
app.engine( 'hbs', hbs.express4( {
  defaultLayout: __dirname + '/public/views/layouts/default.hbs',
  layoutsDir: __dirname + '/public/views/layouts/',
  partialsDir: __dirname + '/public/views/partials/',
}));

const Photos = require(`${__dirname}/src/js/modules/Photos.js`);

console.log("startUp");
//serve from public folder
app.use(express.static('public',{index:false}));
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
	secret: config.secret,
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
app.get('/', (req, res) => {
	res.render('home',{layout: 'default',bodyClass: 'home over'});
});
app.get('/static/:page',(req, res) => {
	res.render(req.params.page,{layout: 'default',bodyClass: `${req.params.page} over`});
});
app.get('/dashboard',sessionChecker, (req, res) => {
	res.render('dashboard', {layout: 'default', modules: modules});
});	
app.get('/chargbee',(req,resp,next) => {
	console.log(req.query.sub_id);
})
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
	let path = `${os.tmpdir()}/icons/`;	
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
app.get('/photos/:img',function(req,res){
	try{
		if(req.params.img.indexOf("jpg")>-1){
			if(fs.existsSync(`${os.tmpdir()}/backgrounds/${req.params.img}`)){
				res.sendFile(`${os.tmpdir()}/backgrounds/${req.params.img}`);
			}else{
				res.sendFile(`${__dirname}/public/img/backgrounds/${req.params.img}`);
			}
			
		}else{
			res.json({})
		}
	}catch(error){
		res.json(error);
	}

});
app.get('/api/:action/:id([0-9]{0,})?/:sub([a-zA-Z]{0,})?',[sessionChecker,getStrava], function(req,res,next){
	let data = "";
	let strava = res.locals.strava;
	let p = {'access_token':res.locals.token,'per_page':100};
	if(req.params.id){
		p = Object.assign({id:req.params.id},p)
	}
	switch (req.params.action) {
		case 'user':
			User.findOne({attributes:['hr','cadence','speed','circumference','units','layout','url','modes','id'], where: { username: req.session.user } }).then(function (user) {
				if(req.params.sub=="all"){
					res.json(user);
				}else if(req.params.sub=="workoutTemplates"){
					user.getWorkoutTemplates().then(workoutTemplates =>{
						res.json(workoutTemplates);
					});
				}else{
					res.json(user[req.params.sub]);
				}
			}).error(function(error){
				data = {"status" : "error", "msg":error};
				res.json(data);
			});
			break;
		case 'workoutTemplate':			

			break;
		case 'modules':
			res.json(modules);
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
	}
});
app.get('/api/:action/:sub1?/:sub2?/:sub3?/public',function(req,res){
	switch (req.params.action) {
		case 'photos' :
			if(req.params.sub1.indexOf("random")>-1){
				(async () => {
					const result = await Photos.randos();
					const randomFile = result[Math.floor(Math.random() * result.length)];
					const color = await Photos.colors(randomFile)
					res.json({url: `/photos/${randomFile}`, color: color})
				})();
			}else{
				(async () => {
					const photo = await Photos.photos(req.params.sub1,req.params.sub2,req.params.sub3);
					const filename = _.last(photo.split('/'))
					const download = await Photos.download(photo);
					const color = await Photos.colors(filename);
					res.json({url: `/photos/${filename}`, color: color})
				})();
			};

		break;
		case 'weather' :
			(async () => {
				var lat = req.params.sub1;
				var lng = req.params.sub2;
				var api = `https://api.darksky.net/forecast/${config.darksky}/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags`;
				var response = await axios(api);
				res.json(response.data);
			})()
			break;
		default:
			data = {"status" : "error", "msg":"Sorry, operation unsupported"};
			res.json(data);
			break;
	}
})
app.post('/api/:action/:sub([a-zA-Z]{0,})?',[sessionChecker,getStrava],function(req,res,next){
	let strava = res.locals.strava;
	switch (req.params.action) {
		case 'publish' :
			var points = req.body.points;
			const { buildGPX, GarminBuilder } = require('gpx-builder');
			const { Point } = GarminBuilder.MODELS;
			const _ = require('lodash');
			var pointsMod = []
			_.forEach(points,function(point){
				pointsMod.push(new Point(point.lat,point.lng,{
					time: point.time,
					hr: point.hr,
					cad: point.cad,
					speed: point.speed
				}))
			})
			const gpxData = new GarminBuilder();

			gpxData.setSegmentPoints(pointsMod);
 
			var rand = Math.floor(Math.random() * Math.floor(99999999));
			var file = `${os.tmpdir()}/gpx${rand}.gpx`;
			fs.writeFileSync(file,buildGPX(gpxData.toObject()));
			strava.uploads.post({
					access_token: res.locals.token,
					file: file,
					name: "Veload Session",
					type: "virtualride",
					data_type: 'gpx',
					statusCallback: function(err,payload){
						res.json(payload);	
					}
				},function(err,rs){
			});
			break;
		case 'user':
			User.findOne({ where: { username: req.session.user } }).then(function (user) {		
				if(req.body.value){
					user[req.params.sub] = req.body.value;
				}else if(req.query.value){
					user[req.params.sub] = req.query.value;
				}else{
					throw new Error("no data found")
				}
				user.save().then(function(user){
					data = {"status" : "success"}
					res.json(data);
				});
			}).error(function(error){
				data = {"status" : "error", "msg":error};
				res.json(data);
			});
			break;
		case 'workoutTemplate':
			User.findOne({ where: { username: req.session.user } }).then(function (user) {	
				if(req.body.value){
					WorkoutTemplate.create({
						data : req.body.value,
						title : req.body.title,
						type : req.body.type,
						length : req.body.len,
						lengthType : req.body.lType
					}).then(function(workoutTemplate) {
						user.addWorkoutTemplates(workoutTemplate).then(function(){
							data = {"status" : "success"}
							res.json(data);
						});
					})
				}else{
					throw new Error("no data found")
				}
			}).error(function(error){
				data = {"status" : "error", "msg":error};
				res.json(data);
			});	
			break;	
		default : 
			data = {"error":"Sorry, operation unsupported"};
			res.json(data);	
			break;
	}
});
app.delete('/api/:action/:sub([a-zA-Z]{0,})?/:id([0-9]{0,})?',[sessionChecker,getStrava],function(req,res,next){
	switch (req.params.action) {
		case 'user':
			switch (req.params.sub) {
				case 'workoutTemplates':
					User.findOne({ where: { username: req.session.user } }).then(function (user) {	
						user.removeWorkoutTemplates(req.params.id);
						data = {"status" : "success"}
						res.json(data);						
					})
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
		axios.post(`https://www.strava.com/oauth/token?client_id=${config.strava.client_id}&client_secret=${config.strava.client_secret}&refresh_token=${user.refresh_token}&grant_type=refresh_token`,{}).then((res) =>
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
	return new Sequelize(config.dbtable, config.dbuser, config.dbpass, {
		host: config.dbhost,
		dialect: 'mysql',
		operatorsAliases: false,
		logging: config.sqlLogging,
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
		layout: {
			type: Sequelize.JSON,
			defaultValue: false
		},
		units: {
			type: Sequelize.ENUM("miles","kilometers"),
			defaultValue: "miles",
		},
		circumference: {
			type: Sequelize.FLOAT,
			defaultValue: 2.120
		},
		url: {
			type: Sequelize.STRING,
			defaultValue: "http://127.0.0.1:3001"
		},
		hr: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		},
		speed: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		}, 
		cadence: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		},
		modes:{
			type: Sequelize.TINYINT,
			defaultValue: 5
		}
	});
	return User;
}
function workoutTemplateModel(sequelize){
	var Workout = sequelize.define('WorkoutTemplate', {
		title: Sequelize.STRING,
		data: Sequelize.JSON,
		length: Sequelize.BIGINT,
		type: Sequelize.ENUM("speed","hr","cadence"),
		lengthType: Sequelize.ENUM("distance","minutes"),
		public: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
	});
	return Workout;
}
function buildAssociations(){
	User.hasMany(WorkoutTemplate, {as:'WorkoutTemplates'});
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
	res.render('login', {layout: 'default', url: url,bodyClass: 'login over'});
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
