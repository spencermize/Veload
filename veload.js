const jQueryBridget = require('jquery-bridget');
const Packery = require("packery");
const Draggabilly = require("draggabilly");
const Chart = require("./build/third_party/Chart.bundle.min.js");
const bootstrap = require("bootstrap");
const Timer = require("easytimer.js").Timer;

const annyang = require("annyang");

//Expose for modules
const Leaflet = require("leaflet");
window.Leaflet = Leaflet;

const moment = require("moment");
window.moment = moment;

const numeral = require("numeral");
window.numeral = numeral;

const geolib = require('geolib');
jQueryBridget( 'packery', Packery, $ );

const local = [];
local["status"] = "status";
local["stats"] = "stats";
const localUrl ="http://localhost:3001/";
for(var key in local){
	local[key] = `${localUrl}${local[key]}`;
};
const remote = [];
const remoteUrl ="/api/";
remote["publish"] = "publish";
remote["athlete"] = "athlete";
for(var key in remote){
	remote[key] = `${remoteUrl}${remote[key]}`;
};

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
		}
	}
};

["allPoints","speeds","cadences","hr","rTrail","cTemps","cMods"].forEach(function(e){
	Veload.prototype[e] = [];
});

["currentConnection", "athlete", "refresher", "desiredSpeed", "startTime", "elapsed", "$grid","route","currLoc","lastUpdate","myIcon","photos"].forEach(function(e){
	Veload.prototype[e] = "";
});


function Veload(opts){
	if (!(this instanceof Veload)) return new Veload(opts);
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
		var query = `${remote.publish}?elapsed=${self.elapsed}&distance=${distance}&start=${self.startTime}`;
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
			error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${remote.publish}) responded (${err.status} ${err.statusText}) <br /> ${query}</p>`);
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
Veload.prototype.initGrid = function(){
	var self = this;
	self.$grid = $('.grid').packery({
		itemSelector: '.grid-item',
		percentPosition: true,
		columnWidth: '.col-lg-2',
	})
	self.$grid.find('.grid-item').each( function( i, gridItem ) {
		var draggie = new Draggabilly( gridItem,{
			handle: ".card-header"
		});
		self.$grid.packery( 'bindDraggabillyEvents', draggie );
	});
	self.$grid.on( 'dblclick', '.grid-item .card-header', function( event ) {
		var $item = $( event.currentTarget ).closest('.grid-item');
		$item.toggleClass('col-lg-8');
		self.$grid.packery('layout');
	});
	self.$grid.on('mouseover', '.grid-item', (function(e){
		var card = $(e.target).closest('.grid-item');
		var time;
		card.addClass('full');
		clearTimeout(time);
		card.on('mouseout',(function(){ 
			clearTimeout(time);
			time = setTimeout(function(){
				$(e.target).closest('.grid-item').removeClass('full');
			},2000);
		}));
	}));		
}
Veload.prototype.loadProfile = function(){
	$.getJSON(remote.athlete,function(data){
		$("body").removeClass("loggedout").addClass("loggedin");
		self.athlete = data;
		$("#profile button").html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + self.athlete.profile +'" />');
	});	
}
Veload.prototype.poll = function(){
	var self = this;
	$.getJSON(local.status,function(data){
		if(data.status && data.status.length){
			self.connected(data);
		}else{
			self.notConnected();
		}
	});
}
Veload.prototype.initTimers = function(){
	var self = this;
	self.timer = new Timer();
	self.timer.addEventListener('secondsUpdated', function (e) {
		self.elapsed = self.timer.getTotalTimeValues().seconds;
	});
}
Veload.prototype.startUpdating = function(){
	self = this;
	self.lastUpdate = moment();
	return setInterval(function(){
		if(self.currentConnection){
			$.getJSON(local.stats,function(data){
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
				$(document).trigger('vUpdated');
			})
		}
	},self.UPDATEFREQ);
}
Veload.prototype.loadGPX = function(url){
		var omni = require("@mapbox/leaflet-omnivore");
		var om = omni.gpx(url);
		var self = this;
		om.on('ready', function(e) {
			var geolib = require("geolib");
			self.route = om.toGeoJSON().features[0].geometry.coordinates;
			var gpx = e.target
			self.map.fitBounds(gpx.getBounds());
			for(coord = 0; coord<self.route.length-1;coord++){
				var s = self.route[coord];
				var f = self.route[coord+1];
				var sl = {lat: s[1], lng: s[0]};
				var fl = {lat: f[1], lng: f[0]};
				var d = geolib.getDistance(sl,fl,1,1);
				var b = geolib.getBearing(sl,fl);
				self.rTrail.push({distance: d, bearing: b, latlng: {lat:sl.lat,lng:sl.lng}});
			}
			self.currLoc = self.rTrail[0].latlng;
			var ico = require("@ansur/leaflet-pulse-icon");
			var pulsingIcon = Leaflet.icon.pulse({
				iconSize:[20,20],
				color: self.GOOD,
				fillColor: self.GOOD
			});
			self.myIcon = Leaflet.marker([self.currLoc.lat,self.currLoc.lng],{icon: pulsingIcon,opacity:.8}).addTo(self.map);
		}).on('error',function(e){
			self.error(e);
		}).addTo(self.map);		
	}
Veload.prototype.loadTrack = function(e){
		self.loadGPX(e.closest("[data-ref]").data("ref"));
		self.unpop();
	}
Veload.prototype.pickTrackGUI = function(){
		var self = this;
		var List = require("list.js");
		var item = $('[data-module="map"] .search-wrap ul.list').cleanWhitespace().html();
		var options = {
			valueNames: [
				'name',
				'days',
				'description',
				{ 'data':['ref','timestamp']}
			],
			item: item,
			page: 5,
			pagination: true
		}
		self.pop({title: "Loading...", accept: false});
		$('#modal').find(".modal-body").loader();
		$.getJSON("/api/athlete/routes",function(routes){
			$.getJSON("/api/athlete/activities",function(activities){
				var data = routes.concat(activities);
					var config = {
					title: 'Please choose a prior Strava Route or Activity',
					accept: false,
					body: $('[data-module="map"] .search-wrap').html()
				}
				self.unpop();
				self.pop(config);
				$('#modal .searcher').attr("id","searchme");
				var list = new List("searchme",options);
				list.clear();
	
				data.forEach(function(el){
					if(el.map.summary_polyline){
						var type;
						var dist = numeral(geolib.convertUnit('mi',el.distance)).format(Veload.MPHFORM);
						if(el.type == "Run" || el.type == "Bike"){
							var avg = numeral(el.average_speed).format(Veload.MPHFORM)
							type = "activities";
							created = el.start_date;
							desc = `You averaged ${avg} mph and traveled ${dist} miles.`;
						}else if(el.type==1){
							type = "routes";
							created = el.created_at;
							desc = `You own this ${dist} mile route.`;
						}else{
							type = false;
						}
						if(type){
							var days = moment(created).fromNow();
							list.add({
								name: el.name,
								timestamp: created,
								days: days, 
								description:desc, 
								ref:`/api/${type}GPX/${el.id}`
							});
						}
					}
				});
			})
		});
	},
Veload.prototype.loadDash = function(){
		var self = this;
		self.initVoice();
		self.poll();
		setInterval(function(){self.poll();},3000);
		self.initGrid();
		$('[data-toggle="tooltip"]').tooltip();
	}
Veload.prototype.fullscreen = function(config){
		if(config.caller!="voice"){
			$('body')[0].requestFullscreen();
		}
	}
Veload.prototype.initVoice = function(){
		self = this;
		if (annyang) {
		// add all commands from buttons that have [data-cmd] (not all functions will be valid)
			var commands = {}
			$('button[data-cmd]').each(function(ind,el){
				var cmd = $(el).data('cmd');
				commands[cmd] = function(){ self[cmd]({caller: "voice"}) }
				
				var alt = $(el).data('voice-alt');
				if(alt){
					alt = alt.split(',');
					alt.forEach(function(el){
						commands[el] = function(){ self[cmd]({caller: "voice"}) }
					});
				}
			});

			// Add our commands to annyang
			annyang.addCommands(commands);

			annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
				$('.speech').addClass('show').text(userSaid);
				setTimeout(function(){
					$('.speech').removeClass('show');
				},3000);
			});

			// Start listening.
			annyang.start({ autoRestart: true });
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
		$('.modal-backdrop').remove();
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
	$('#modal').on('hidden.bs.modal',function(){
		console.log("removing stuff");
		$('#modal').modal('dispose');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	});		
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
Veload.prototype.loadInterface = function(){
	var self = this;
	// load required elements
	elements = ['modal','footer'];
	
	//ensure timers are ready to go so we can attach listeners;
	self.initTimers();
	
	elements.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		self.cTemps[templ] = Handlebars.compile(src);	
	});
	
	// load modules
	if(typeof modules !== 'undefined'){
		var self = this;
		modules.forEach(function(mod){
			var name = mod+"-module";
			var el = document.getElementById(name);
			var src = el.innerHTML;
			self.cMods[mod] = Handlebars.compile(src);
			$('.grid').append(self.cMods[mod]());	
			$(document).on(`${mod}Loaded`,function(){
				console.log(mod);
				self[mod]();
			});
		});
		$("[data-submodule]").each(function(index,sub){
			var src = $("#"+$(sub).data("submodule")+"-sub").html();
			var cmp = Handlebars.compile(src);
			$(sub).closest(".grid-item").find(".card-body").html(cmp);
		});
	}
	var veloaded = new CustomEvent('veloaded', {bubbles: true, cancelable: true});
	document.dispatchEvent(veloaded);
}

//===============HELPERS===================
$.fn.loader = function(height=64,width=64){
	$(this).empty().append(`<img class='mx-auto' src='/img/loading.gif' width='${width}' height='${height} class='img-flex'/>`);
	return this;
}
$.fn.cleanWhitespace = function() {
    this.contents().filter(
        function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
        .remove();
    return this;
}
Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

module.exports = Veload;