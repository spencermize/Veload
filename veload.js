const Handlebars = require('handlebars');
const $ = require("jquery");
const jQueryBridget = require('jquery-bridget');
const Packery = require("packery");
const Draggabilly = require("draggabilly");
const Chart = require("./third_party/Chart.bundle.min.js");
const bootstrap = require("bootstrap");
const Timer = require("easytimer");
const moment = require("moment");
const numeral = require("numeral");
const annyang = require("annyang");
const Leaflet = require("leaflet");
const gpx = require("leaflet-gpx");
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
var myChart, refresher, desiredSpeed, startTime, elapsed, ctx, $grid, mod, maps;
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
	},
	pause: function(){
		$('body').toggleClass('play pause');
		timer.pause();
		clearInterval(refresher);
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
			columnWidth: '.col-lg-4',
		})
		$grid.find('.grid-item').each( function( i, gridItem ) {
			var draggie = new Draggabilly( gridItem,{
				handle: ".card-header"
			});
			$grid.packery( 'bindDraggabillyEvents', draggie );
		});
		$grid.on( 'dblclick', '.grid-item .card-header', function( event ) {
			var $item = $( event.currentTarget ).closest('.grid-item');
			$item.toggleClass('col-lg-8 col-lg-4');
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
		return setInterval(function(){
			if(currentConnection){
				$.getJSON(local.speed,function(data){

					var speed = new Number(data.speed);
					desiredSpeed = $("#desiredSpeed").val();
					$("#currSpeed").html(numeral(speed).format(Veload.MPHFORM) + "mph");
					$("#distance").html(numeral(getDistance(speeds,elapsed)).format(Veload.MPHFORM) + " miles");
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
					speeds.push(speed);
					$("#avgSpeed").html(numeral(getAvg(speeds)).format(Veload.MPHFORM) + "mph");					
				})
			}
		},Veload.UPDATEFREQ);
	},
	map: function(){
		var el = $('.map')[0];
		map = Leaflet.map(el);
		Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
		}).addTo(map);
	},
	loadGPX: function(url){
		new Leaflet.GPX(url, {
			async: true
		}).on('loaded', function(e) {
			console.log(e);
			var gpx = e.target
			map.fitBounds(gpx.getBounds());
		}).addTo(map);
	},
	loadTrack: function(e){
		self.loadGPX(e.closest("[data-ref]").data("ref"));
		self.unpop();
	},
	pickTrackGUI: function(){
		var self = this;
		var List = require("list.js");
		var item = $('[data-module="map"] .search-wrap ul').cleanWhitespace().html();
		var options = {
			valueNames: [
				'name',
				'days',
				'description',
				'distance',
				{ 'data':['ref','timestamp']}
			],
			item: item
		}
		self.pop({title: "Loading...", accept: false});
		$('#modal').find(".modal-body").loader();
		$.getJSON("/api/athlete/routes",function(data){
			self.unpop();
			var config = {
				title: 'Please choose a prior Strava Route or Activity',
				accept: false,
				body: $('[data-module="map"] .search-wrap').html()
			}
			self.pop(config);
			var search = $('#modal .searcher')[0];
			var list = new List(search,options);
			list.clear();
			data.forEach(function(el){
				var days = moment(el.created_at).fromNow();
				list.add({
					name: el.name,
					timestamp: el.created_at,
					days: days, distance: `${numeral(el.distance).format(Veload.MPHFORM)} meters`, 
					description:el.description, 
					ref:`/api/routesGPX/${el.id}`
				});
			});			
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
	initVoice: function(){
		self = this;
		if (annyang) {
		// Let's define a command.
			var commands = {
			'start': function() { self.start(); },
			'pause': function() { self.pause(); },
			'stop': function() { self.stop(); },
			'clear': function() { self.clear(); }
			};

			// Add our commands to annyang
			annyang.addCommands(commands);

			annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
				$('.speech').text(userSaid);
			});

			// Start listening.
			annyang.start({ autoRestart: true });
		}
	},
	notConnected: function(){
		var self = this;
		var config = {
			title: 'Error!',
			body: 'Please check that your sensor is connected in the veload monitor!',
			accept: true,
			close: false,
			backdrop: 'static',
			acceptText: 'Retry',
			modalClass: 'disco'
		}
		const events = {
			acceptClick: function(){
				self.poll()
			}
		}
		this.pop(config,events);
		config = {
			status: `No sensor connection`,
			statusClass: 'bg-warning'
		}
		$('footer').html(cTemps.footer(config));		

	},
	connected: function(data){
		currentConnection = data.status;
		const config = {
			status: `veload connected on port ${data.status}`,
			statusClass: 'bg-info'
		}
		if($('#modal').hasClass('disco')){
			unpop();
		}
		$('footer').html(cTemps.footer(config));
	},
	unpop: function(){
		$('#modal').modal('hide').on('hidden.bs.modal',function(){
			$('#modal').modal('dispose');
			$('.modal-backdrop').remove();
		});
	},	
	pop: function(cnf = {}, evt = {}){
		const config = Object.assign({
			title: 'Alert',
			body: '',
			accept: true,
			close: true,
			backdrop: true,
			acceptText: 'Okay',
			modalClass: ''
		},cnf);
		const events = Object.assign({
			cancelClick: function(){},
			acceptClick: function(){}
		},evt);
		
		
		if(!($("#modal").data('bs.modal') || {})._isShown){
			$('#modal-container').html(cTemps.modal(config));
			$('#modal .btn-cancel').on('click',events.cancelClick);
			$('#modal .btn-accept').on('click',events.acceptClick);
			$('#modal').modal('show');			
		}
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
	$(this).empty().append(`<img src='/img/loading.gif' width='${width}' height='${height} class='img-flex'/>`);
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