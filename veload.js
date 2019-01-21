const Handlebars = require('handlebars');
const $ = require("jquery");
const jQueryBridget = require('jquery-bridget');
const Packery = require("packery");
const Draggabilly = require("draggabilly");
const Chart = require("./build/third_party/Chart.bundle.min.js");
const bootstrap = require("bootstrap");
const Timer = require("easytimer");
const moment = require("moment");
const numeral = require("numeral");
const annyang = require("annyang");
const Leaflet = require("leaflet");
const geolib = require('geolib');
jQueryBridget( 'packery', Packery, $ );

const local = [];
local["status"] = "status";
local["speed"] = "speed";
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

var allPoints = [];
var speeds = [];
var rTrail = [];
var tTrail = [];
var myChart, refresher, desiredSpeed, startTime, elapsed, ctx, $grid, mod, maps,route,currLoc,lastUpdate,myIcon,photos;
var timer = new Timer;

var athlete = "";
const cTemps = [];
const cMods = [];
var currentConnection = "";
const Veload = {
	UPDATEFREQ: 500,
	MPHFORM: '0,000.00',
	GOOD: "#28a745",
	GOODBG: "#53F377",
	BAD: "#dc3545",
	BADBG: "#E27A84",
	start: function(){
		$('body').toggleClass('play pause stoppable');
		startTime = new Date().toISOString();
		timer.start();
		refresher = this.startUpdating();
		photos = this.photoRefresher();
	},
	photoRefresher: function(){
		var radius = .5;
		return setInterval(function(){
			const maxResults = 50;
			$.getJSON(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f01b5e40d794a63ebd9b51fd4eb985ab&lat=${currLoc.lat}&lon=${currLoc.lng}&format=json&extras=url_o,url_k,url_h&radius=${radius}&per_page=${maxResults}&tags=beautiful,pretty,sunset,sunrise,architecture&sort=interestingness-desc&content_type=1&nojsoncallback=1,has_geo=true`,function(data){
				var url = "";
				if(data.photos.total>0){
					var attempts = 0;
					console.log(attempts < (data.photos.photo.length));
					while(!url && attempts < (data.photos.photo.length)){
						const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length-1))];
						url = p.url_o ? p.url_o : p.url_k;
						console.log('attempting...' + url);
						attempts++;
					}
					if(!url){
						url = data.photos.photo[0].url_h;
						radius = radius * 2;
					}					
					if(url && `url("${url}")` != $('.bg.blurrer').css('background-image')){
						$('<img/>').attr('src', url).on('load', function() {
							$(this).remove(); // prevent memory leaks as @benweet suggested
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
	},
	pause: function(){
		$('body').toggleClass('play pause');
		timer.pause();
		clearInterval(refresher);
		clearInterval(photos);
	},
	stop: function(){
		this.pause();
		if(startTime){
			const self = this;
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
			this.pop(config,events);	
		}
	},
	upload:function(){
		const self = this;
		var avg = getAvg(speeds);
		var distance = getDistance(speeds,elapsed);
		$('.modal-footer').loader(36,36);
		var query = `${remote.publish}?elapsed=${elapsed}&distance=${distance}&start=${startTime}`;
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
	},
	error: function(err){
		var config = {
			title: "Error",
			body: `${err}`,
			accept: false,
			close: true,
		}
		console.log(err);
		this.unpop();
		this.pop(config);
	},
	clear: function(){
		allPoints = [];
		speeds = [];
		timer.reset();
		timer.stop();
		myChart.data.datasets[0].data = []
		myChart.update();
		$("body").removeClass('stoppable');
	},
	initGrid: function(){
		$grid = $('.grid').packery({
			itemSelector: '.grid-item',
			percentPosition: true,
			columnWidth: '.col-lg-2',
		})
		$grid.find('.grid-item').each( function( i, gridItem ) {
			var draggie = new Draggabilly( gridItem,{
				handle: ".card-header"
			});
			$grid.packery( 'bindDraggabillyEvents', draggie );
		});
		$grid.on( 'dblclick', '.grid-item .card-header', function( event ) {
			var $item = $( event.currentTarget ).closest('.grid-item');
			$item.toggleClass('col-lg-8');
			$grid.packery('layout');
		});
	},
	loadProfile: function(){
		$.getJSON(remote.athlete,function(data){
			$("body").removeClass("loggedout").addClass("loggedin");
			athlete = data;
			$("#profile button").html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + athlete.profile +'" />');
		});	
	},
	poll: function(){
		$.getJSON(local.status,function(data){
			if(data.status && data.status.length){
				Veload.connected(data);
			}else{
				Veload.notConnected();
			}
		});
	},
	initTimers: function(){
		timer.addEventListener('secondsUpdated', function (e) {
			$('#elapsedTime').html(timer.getTimeValues().toString());
			elapsed = timer.getTotalTimeValues().seconds;
		});
		timer.addEventListener('started', function (e) {
			$('#elapsedTime').html(timer.getTimeValues().toString());
		});
		timer.addEventListener('reset', function (e) {
			$('#elapsedTime').html(timer.getTimeValues().toString());
		});	
	},
	startUpdating: function(){
		self = this;
		lastUpdate = moment();
		return setInterval(function(){
			if(currentConnection){
				$.getJSON(local.speed,function(data){

					var speed = new Number(data.speed);
					var metSpeed = speed * 1609.344;
					
					// speed point * (time since last update -> seconds -> minutes -> hours)
					var distance = metSpeed * (moment().diff(lastUpdate) / 1000 / 60 / 60);
					console.log("traveled " + distance);
					lastUpdate = moment();
					if(distance){
						while(distance>rTrail[0].distance){
							console.log("Change up!");
							//change direction
							//first, just bump us to the next waypoint
							currLoc = rTrail[1].latlng;
							//then, set the distance remaining after we get to the new waypoint
							distance = distance - rTrail[0].distance;
							//then, ditch the old waypoint
							rTrail.shift();
						}
						
						rTrail[0].distance = rTrail[0].distance - distance;
						console.log(rTrail[0].distance + " remaining until waypoint");
						var newLoc = geolib.computeDestinationPoint(currLoc,distance,rTrail[0].bearing);
						currLoc.lat = newLoc.latitude;
						currLoc.lng = newLoc.longitude;
						myIcon.setLatLng(currLoc);
					}
					desiredSpeed = $("#desiredSpeed").val();
					myChart.data.datasets.forEach((dataset) => {
						dataset.data.push({t:Date.now(),y:speed});
						allPoints.push({t:Date.now(),y:speed});
						if(speed>=desiredSpeed){
							dataset.pointBackgroundColor.push(Veload.GOOD);
							dataset.backgroundColor = Veload.GOODBG;
						}else{
							dataset.pointBackgroundColor.push(Veload.BAD);
							dataset.backgroundColor = Veload.BADBG;
						}
						if(dataset.data.length > (5*120)){
							dataset.data.shift();
							dataset.pointBackgroundColor.shift();
						}
					});
					myChart.update();
					map.flyTo(currLoc,18);
					speeds.push(speed);
					
					$("#currSpeed").html(numeral(speed).format(Veload.MPHFORM) + " mph");
					$("#distance").html(numeral(getDistance(speeds,elapsed)).format(Veload.MPHFORM) + " miles");					
					$("#avgSpeed").html(numeral(getAvg(speeds)).format(Veload.MPHFORM) + " mph");
				})
			}
		},Veload.UPDATEFREQ);
	},
	loadGPX: function(url){
		var omni = require("@mapbox/leaflet-omnivore");
		var om = omni.gpx(url);
		om.on('ready', function(e) {
			var geolib = require("geolib");
			route = om.toGeoJSON().features[0].geometry.coordinates;
			var gpx = e.target
			map.fitBounds(gpx.getBounds());
			for(coord = 0; coord<route.length-1;coord++){
				var s = route[coord];
				var f = route[coord+1];
				var sl = {lat: s[1], lng: s[0]};
				var fl = {lat: f[1], lng: f[0]};
				var d = geolib.getDistance(sl,fl);
				var b = geolib.getBearing(sl,fl);
				rTrail.push({distance: d, bearing: b, latlng: {lat:sl.lat,lng:sl.lng}});
			}
			currLoc = rTrail[0].latlng;
			var ico = require("@ansur/leaflet-pulse-icon");
			var pulsingIcon = Leaflet.icon.pulse({
				iconSize:[20,20],
				color: Veload.GOOD,
				fillColor: Veload.GOOD
			});
			myIcon = Leaflet.marker([currLoc.lat,currLoc.lng],{icon: pulsingIcon,opacity:.8}).addTo(map);
		}).on('error',function(e){
			Veload.error(e);
		}).addTo(map);		
	},
	map: function(){
		var el = $('.map')[0];
		map = Leaflet.map(el,{
			zoom: 9,
			center: [51.505, -0.09]
		});
		navigator.geolocation.getCurrentPosition(function(position) {
			map.panTo([position.coords.latitude,position.coords.longitude]);
			currLoc = {lat:position.coords.latitude,lng:position.coords.longitude};
		});		
		Leaflet.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=9550bf2f19b74edfbf935882be6d687e', {

		}).addTo(map);
	},	
	loadTrack: function(e){
		self.loadGPX(e.closest("[data-ref]").data("ref"));
		self.unpop();
	},
	pickTrackGUI: function(){
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
				var list = new List(searchme,options);
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
	loadDash: function(){
		var self = this;
		self.initVoice();
		myChart = self.initChart();
		self.map();
		self.initTimers();
		self.poll();
		setInterval(function(){self.poll();},3000);
		self.initGrid();
		$('[data-toggle="tooltip"]').tooltip();
		$('.grid-item').on('mouseover',(function(e){
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
	},
	initChart: function(){
		if($('#myChart').length){
			return new Chart(document.getElementById("myChart").getContext('2d'), {
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
			});
		}
	},
	fullscreen: function(config){
		if(config.caller!="voice"){
			$('body')[0].requestFullscreen();
		}
	},
	initVoice: function(){
		self = this;
		if (annyang) {
		// add all commands from buttons that have [data-cmd] (not all functions will be valid)
			var commands = {}
			$('button[data-cmd]').each(function(ind,el){
				var cmd = $(el).data('cmd');
				commands[cmd] = function(){ self[cmd]({caller: "voice"}) }
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
	},
	notConnected: function(){
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
	connected: function(data){
		currentConnection = data.status;
		const config = {
			status: `veload connected on port ${data.status}`,
			statusClass: ''
		}
		if($('#modal').hasClass('disco')){
			self.unpop();
		}
	},
	unpop: function(){
		$('#modal').modal('hide');
		$('.modal-backdrop').remove();
	},	
	pop: function(cnf = {}, evt = {}){
		const config = Object.assign({
			title: 'Alert',
			body: '',
			accept: true,
			close: true,
			acceptText: 'Okay',
			modalClass: '',
			backdrop: 'static'
		},cnf);
		const events = Object.assign({
			cancelClick: function(){},
			acceptClick: function(){}
		},evt);
		$('#modal-container').html(cTemps.modal(config));
		$('#modal .btn-cancel').on('click',events.cancelClick);
		$('#modal .btn-accept').on('click',events.acceptClick);
		$('#modal').on('hidden.bs.modal',function(){
			console.log("removing stuff");
			$('#modal').modal('dispose');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		});		
		$('#modal').modal('show');			
	},
	loadInterface: function(){
		elements = ['modal','footer'];
		elements.forEach(function(templ){
			var src = document.getElementById(`${templ}-temp`).innerHTML;
			cTemps[templ] = Handlebars.compile(src);	
		});
		if(typeof modules !== 'undefined'){
			modules.forEach(function(mod){
				var name = mod+"-module";
				var src = document.getElementById(name).innerHTML;
				cMods[mod] = Handlebars.compile(src);
				var config = {

				}
				$('.grid').append(cMods[mod](config));			
			});
			$("[data-submodule]").each(function(index,sub){
				var src = $("#"+$(sub).data("submodule")+"-sub").html();
				var cmp = Handlebars.compile(src);
				$(sub).closest(".grid-item").find(".card-body").html(cmp);
			});
		}
	}
};

//===============HELPERS===================
function getAvg(speeds){
	return speeds.reduce(function(a,b){
		return a + b
	}, 0) / speeds.length
}
function getDistance(speeds,elapsed){
	return getAvg(speeds) * (elapsed / 60 / 60);
}
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