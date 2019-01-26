//Expose common libraries for modules
const Chart = require("../third_party/Chart.bundle.min.js");
const bootstrap = require("bootstrap");

const _ = require('lodash');
window._ = _;

require('../third_party/gridster/jquery.gridster.min.js');

const Timer = require("easytimer.js").Timer;
window.Timer = Timer;

const Leaflet = require("leaflet");
window.Leaflet = Leaflet;

const moment = require("moment");
window.moment = moment;

const numeral = require("numeral");
window.numeral = numeral;

const List = require("list.js");
window.List = List;

const omni = require("@mapbox/leaflet-omnivore");
window.omni = omni;

const geolib = require("geolib");
window.geolib = geolib;

const ico = require("@ansur/leaflet-pulse-icon");
window.ico = ico;

const local = [];
local["status"] = "status";
local["stats"] = "stats";
const localUrl ="http://localhost:3001";
for(var key in local){
	local[key] = `${localUrl}/${local[key]}`;
};
var r = ["publish","athlete","athlete_routes","athlete_activities","user_layout","user_modules"];
var remote = [];
const remoteUrl ="/api";

_.forEach(r,function(n){
	var k = n.replace("_","/");
	var l = _.camelCase(n);
	remote[l] = `${remoteUrl}/${k}`;
});

//set some defaults
Veload.prototype.UPDATEFREQ = 500;
Veload.prototype.MPHFORM = '0,000.00';
Veload.prototype.GOOD = "#28a745";
Veload.prototype.GOODBG = "#53F377";
Veload.prototype.BAD = "#dc3545";
Veload.prototype.BADBG = "#E27A84";
Veload.prototype.chartOps = {
	type: 'line',
	data: {
		datasets:[{
			data: [],
			pointRadius: 3,
			pointBackgroundColor: []
		}]
	},
	options: {
		tooltips: {
			enabled: false
		},
		scales: {
			xAxes: [{
				type: 'time',
				time: {
					unit: 'minute'
				}
			}],
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		},
		legend: {
			display: false
		},
		responsive: true,
		maintainAspectRatio: false,
		responsiveAnimationDuration: 400
	}
};
Veload.prototype.remote = remote;
Veload.prototype.local = local;

["allPoints","speeds","cadences","hr","rTrail","cTemps","enabledMods","modLoadQueue"].forEach(function(e){
	Veload.prototype[e] = [];
});

["currentConnection", "athlete", "refresher", "desiredSpeed", "startTime", "elapsed", "$grid","route","currLoc","lastUpdate","myIcon","photos"].forEach(function(e){
	Veload.prototype[e] = "";
});


function Veload(opts){
	if (!(this instanceof Veload)) return new Veload(opts);
}
Veload.prototype.settings = function(){
	var src = $('#settings-temp').html();
	self.loading();
	$.getJSON(remote.userModules,function(data){
		var opts = {
			enabledMods : _.map(self.enabledMods,function(e){return [e,_.startCase(e)]}),
			allMods : _.map(data,function(e){return [e,_.startCase(e)]}), 
			links : ["visibility","test"]
		}
		//console.log(opts);
		var comp = Handlebars.compile(src);
		comp = comp(opts);
		var popts = {
			title: "Veload Settings",
			body: comp,
			accept: false
		}
		self.unpop();
		self.pop(popts);
		_.forEach(_.difference(data,self.enabledMods),function(el){
			$(`[data-name=${el}] .btn-toggle`).removeClass('active');
		});
	})
}
Veload.prototype.moduleToggle = function(e){
	var e = $(e);
	var el = e.closest('[data-name]').data("name");
	if(e.closest('.btn-toggle').hasClass("active")){
		self.enableModule(el);
		self.loaded();
	}else{
		self.disableModule(el);
	}
}
Veload.prototype.disableModule = function(mod){
	var el = $(`.grid-item[data-name=${mod}]`);
	el.fadeOut(400,function(){
		_.pull(self.enabledMods,mod);
		$('.grid').data('grid').remove_widget(el);
		self.saveLayout();			
	})
}

Veload.prototype.enableModule = function(mod,cnf){
	self.enabledMods.push(mod);
	const config = Object.assign({
		size_x: 1,
		size_y: 1,
		col: 1,
		row: 1
	},cnf);
	var name = mod+"-module";
	var el = document.getElementById(name);
	var src = el.innerHTML;
	var finishedEvent = `initialized.${mod}`;
	
	$.getScript(`/js/_${mod}.js`,function(){
		self[mod]();
	})
	
	console.log("waiting for " + finishedEvent);
	self.listenForFinish(finishedEvent);

	$('.grid').data('grid').add_widget(Handlebars.compile(src)(), config.size_x, config.size_y,config.col,config.row);
}

Veload.prototype.saveLayout = function(){
	var data = [];
	var e = $('.grid').data('grid');
	e = e.serialize();
	_.forEach(e,function(el,index){
		e[index]["name"] = $(`.grid-item:nth-of-type(${index+1})`).data('name');
	});
	data.push(e)
	$.post(self.remote.userLayout,{layout:data},function(data){
		console.log('layout saved');
	});
}
Veload.prototype.listenForFinish = function(finishedEvent){
	self.modLoadQueue.push(finishedEvent);
	$(document).one(finishedEvent,function(){
		console.log(finishedEvent);
	_.pull(self.modLoadQueue,finishedEvent);
		//console.log(modulesLoad);
		if(self.modLoadQueue.length==0){
			$(document).trigger('modulesLoaded.veload');
			console.log('modulesLoaded.veload');
		}
	});		
}
Veload.prototype.start = function(){
	var self = this;
	$('body').addClass('playing stoppable');
	$('body').removeClass('paused');
	self.startTime = new Date().toISOString();
	self.timer.start();
	self.refresher = self.startUpdating();
	self.photos = self.photoRefresher();
	$(document).trigger("vStart");
}

Veload.prototype.pause = function(){
	var self = this;
	$('body').removeClass('playing');
	$('body').addClass('paused');
	self.timer.pause();
	clearInterval(self.refresher);
	clearInterval(self.photos);
	$(document).trigger("vPause");
}
Veload.prototype.stop = function(){
	var self = this;
	self.pause();
	if(self.startTime){
		var config = {
			title: "End ride?",
			body: "Are you sure you want to end this ride and upload to Strava?",
			accept: true,
			close: true,
			acceptText: "Finish",
			cancelText: "Go back"
		}
		const events = {
			acceptClick: function(){
				self.upload();
			}
		}
		self.pop(config,events);	
	}
	$(document).trigger("vStop");
}
Veload.prototype.clear = function(){
	self = this;
	self.pause();
	var config = {
			title: "Clear this ride?",
			body: "Are you sure you want to clear your ride? You will lose all data in this window.",
			accept: true,
			close: true,
			acceptText: "Clear",
			acceptClass: "btn-danger",
			cancelText: "Go back"
		}
		const events = {
			acceptClick: function(){
				self.allPoints = [];
				self.speeds = [];
				self.timer.reset();
				$("body").removeClass('stoppable');
				self.unpop();
				$(document).trigger("vClear");
			}
		}
		self.pop(config,events);	
}
Veload.prototype.photoRefresher = function(){
	var radius = .5;
	return setInterval(function(){
		const maxResults = 50;
		$.getJSON(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f01b5e40d794a63ebd9b51fd4eb985ab&lat=${self.currLoc.lat}&lon=${self.currLoc.lng}&format=json&extras=url_o,url_k,url_h&radius=${radius}&per_page=${maxResults}&tags=beautiful,pretty,sunset,sunrise,architecture,landscape,building,outdoors,trail,travel&sort=interestingness-desc&content_type=1&nojsoncallback=1,has_geo=true`,function(data){
			var url = "";
			if(data.photos.total>0){
				var attempts = 0;
				if(data.photos.total < 20){
					radius = radius * 2;
				}
				while(!url && attempts < (data.photos.photo.length)){
					const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length-1))];
					url = p.url_o ? p.url_o : p.url_k;
					console.log('attempting...' + url);
					attempts++;
				}
				if(!url){
					radius = radius * 2;
					url = data.photos.photo[0].url_h;
				}					
				if(url && `url("${url}")` != $('.bg.blurrer').css('background-image')){
					$('<img/>').attr('src', url).on('load', function() {
						$(this).remove();
						var el1 = $('.bg.blurrer').addClass("curr");
						el1.before("<span class='bg blurrer' />");
						var el2 = $('.bg.blurrer:not(.curr)');
						el2.css({'background-image':`url(${url})`});
						el2.addClass('in');
						$('.bg.blurrer.curr').removeClass('in');
						setTimeout(function(){$('.bg.blurrer.curr').remove();},2000);
					});
				}
			}else{
				radius = radius * 2;
			}
		});
	},15000);
}
Veload.prototype.upload = function(){
		var self = this;
		var avg = self.getAvg();
		var distance = self.getDistance();
		$('.modal-footer').loader(36,36);
		var query = `${self.remote.publish}?elapsed=${self.elapsed}&distance=${distance}&start=${self.startTime}`;
		$.post(query,function(data){
			if(data.id){
				var config = {
					title: "Congrats!",
					body: "Congratulations, your ride has been uploaded!",
					accept: false,
					close: true,
					cancelText: "Finish"
				}
				$('#modal').on('hidden.bs.modal',function(){
					self.pop(config);
				});
				self.unpop();
			}else{
				error("Error uploading to Strava");
			}
		}).fail(function(err){
			console.log(err);
			error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${self.remote.publish}) responded (${err.status} ${err.statusText}) <br /> ${query}</p>`);
		});
	}
Veload.prototype.error = function(err){
	var config = {
		title: "Error",
		body: `${err}`,
		accept: false,
		close: true,
	}
	console.log(err);
	this.unpop();
	this.pop(config);
}


Veload.prototype.poll = function(){
	var self = this;
	$.getJSON(self.local.status,function(data){
		if(data.status && data.status.length){
			self.connected(data);
		}else{
			self.notConnected();
		}
	});
}

Veload.prototype.startUpdating = function(){
	self = this;
	self.lastUpdate = moment();
	return setInterval(function(){
		if(self.currentConnection){
			$.getJSON(self.local.stats,function(data){
				//expect meters/second
				var metSpeed = new Number(data.speed);
				
				// m/s -> mph
				var speed = metSpeed * 2.23694;
											
				// speed point * (time since last update -> seconds)
				var distance = metSpeed * (moment().diff(self.lastUpdate) / 1000 );
								console.log(distance);
				console.log("traveled " + distance);
				self.lastUpdate = moment();
				if(distance && self.rTrail.length){
					while(distance>self.rTrail[0].distance){
						console.log("Change up!");
						//change direction
						//first, just bump us to the next waypoint
						self.currLoc = self.rTrail[1].latlng;
						//then, set the distance remaining after we get to the new waypoint
						distance = distance - self.rTrail[0].distance;
						//then, ditch the old waypoint
						self.rTrail.shift();
					}
					
					self.rTrail[0].distance = self.rTrail[0].distance - distance;
					console.log(self.rTrail[0].distance + " remaining until waypoint");
					var newLoc = geolib.computeDestinationPoint(self.currLoc,distance,self.rTrail[0].bearing);
					self.currLoc.lat = newLoc.latitude;
					self.currLoc.lng = newLoc.longitude;
					self.myIcon.setLatLng(self.currLoc);
				}
				self.desiredSpeed = $("#desiredSpeed").val();
				self.allPoints.push({t:Date.now(),y:speed});
				self.speeds.push(speed);
				self.hr.push(data.hr);
				self.cadences.push(data.cadence);
				$(document).trigger('locationUpdated.veload');
			})
		}
	},self.UPDATEFREQ);
}

Veload.prototype.fullscreen = function(config){
		if(config.caller!="voice"){
			$('body')[0].requestFullscreen();
		}
	}

Veload.prototype.notConnected = function(){
		if(!$('.disco').length){
			var self = this;
			var config = {
				title: 'Error!',
				body: 'Please check that your sensor is connected in the veload monitor!',
				accept: true,
				close: false,
				acceptText: 'Retry',
				modalClass: 'disco'
			}
			const events = {
				acceptClick: function(){
					self.poll()
				}
			}
			this.pop(config,events);
		}
	},
Veload.prototype.connected = function(data){
		self.currentConnection = data.status;
		const config = {
			status: `veload connected on port ${data.status}`,
			statusClass: ''
		}
		if($('#modal').hasClass('disco')){
			self.unpop();
		}
	},
Veload.prototype.unpop = function(){
		$('#modal').modal('hide');
		$('body').removeClass('loading');
}
Veload.prototype.pop = function(cnf = {}, evt = {}){
	var self = this;
	const config = Object.assign({
		title: 'Alert',
		body: '',
		accept: true,
		close: true,
		acceptText: 'Okay',
		acceptClass: 'btn-primary',
		modalClass: '',
		backdrop: 'static'
	},cnf);
	const events = Object.assign({
		cancelClick: function(){},
		acceptClick: function(){}
	},evt);
	console.log("loading modal");
	$('#modal-container').html(self.cTemps.modal(config));
	$('#modal .btn-cancel').on('click',events.cancelClick);
	$('#modal .btn-accept').on('click',events.acceptClick);
	$('#modal').modal('show');			
}
Veload.prototype.getAvg = function(){
	var self = this;
	return self.speeds.reduce(function(a,b){
		return a + b
	}, 0) / self.speeds.length
}
Veload.prototype.getDistance = function(){
	var self = this;
	return self.getAvg(self.speeds) * (self.elapsed / 60 / 60);
}
Veload.prototype.loading = function(){
	$('body').addClass('loading');
}

//===============HELPERS===================
$.fn.loader = function(height=64,width=64){
	$(this).append(loadAni(height,width));
	return this;
}
function loadAni(height=64,width=64){
	return `<span style='height:${height}px;width:${width}px' class='spin'/>`;
}
$.fn.cleanWhitespace = function() {
    this.contents().filter(
        function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
        .remove();
    return this;
}

Handlebars.registerHelper({
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function () {
        return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
	debug: function(optionalValue) {
	  console.log("Current Context");
	  console.log("====================");
	  console.log(this);

	  if (optionalValue) {
		console.log("Value");
		console.log("====================");
		console.log(optionalValue);
	  }
	},
	ifIn: function(elem, list, options) {
		if(list){
			console.log(list);
			console.log(elem);
			if(list.indexOf(elem) > -1) {
				return options.fn(this);
			}
			return options.inverse(this);
		}else{
			return false;
		}
	}	
});

module.exports = Veload;