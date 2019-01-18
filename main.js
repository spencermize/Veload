const Handlebars = require('handlebars');
const $ = require("jquery");
const jQueryBridget = require('jquery-bridget');
const Packery = require("packery");
const Draggabilly = require("draggabilly");
const Chart = require("./third_party/Chart.bundle.min.js");
const bootstrap = require("bootstrap");
const Timer = require("easytimer");
const numeral = require("numeral");
const annyang = require("annyang");

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
var myChart, refresher, desiredSpeed, startTime, elapsed, ctx, $grid;
var timer = new Timer;
const Veload = {
	updateFreq: 500,
	mphForm: '0.00',
	good: "#28a745",
	goodBG: "#53F377",
	bad: "#dc3545",
	badBG: "#E27A84",
	start: function(){
		$('body').toggleClass('play pause stoppable');
		startTime = new Date().toISOString();
		timer.start();
		refresher = startUpdating();
	},
	pause: function(){
		$('body').toggleClass('play pause');
		timer.pause();
		clearInterval(refresher);
	},
	stop: function(){
		this.pause();
		if(startTime){
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
					upload();
				}
			}
			pop(config,events);	
		}
	},
	upload:function(){
		let avg = getAvg();
		let distance = getDistance();
		$('.modal-footer').loader(36,36);
		let query = `${remote.publish}?elapsed=${elapsed}&distance=${distance}&start=${startTime}`;
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
					pop(config);
				});
				unpop();
			}else{
				error("Error uploading to Strava");
			}
		}).fail(function(err){
			console.log(err);
			error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${remote.publish}) responded (${err.status} ${err.statusText}) <br /> ${query}</p>`);
		});
	}	
};
var athlete = "";
const cTemps = [];
const cMods = [];
var currentConnection = "";
let mod;
$(function(){
	loadProfile();
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
	$('body').on('click','button[data-cmd]', function(e){
		let fnc = $(e.target).closest('button[data-cmd]').data('cmd');
		console.log(fnc);
		Veload[fnc]();
	});	
	if(window.location.pathname=="/dashboard"){
		initVoice();
		myChart = initChart();
		initTimers();
		poll();
		setInterval(function(){poll();},3000);
		initGrid();
	}
});
var initGrid = function(){
	$grid = $('.grid').packery({
		itemSelector: '.grid-item',
		percentPosition: true,
		columnWidth: '.col-lg-4',
	})
	$grid.find('.grid-item').each( function( i, gridItem ) {
		var draggie = new Draggabilly( gridItem );
		$grid.packery( 'bindDraggabillyEvents', draggie );
	});
	$grid.on( 'dblclick', '.grid-item .card-header', function( event ) {
		var $item = $( event.currentTarget ).closest('.grid-item');
		$item.toggleClass('col-lg-8 col-lg-4');
		$grid.packery('layout');
	});
}
var loadProfile = function(){
	$.getJSON(remote.athlete,function(data){
		$("body").removeClass("loggedout").addClass("loggedin");
		athlete = data;
		$("#profile button").html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + athlete.profile +'" />');
	});	
};
var poll = function(){
	$.getJSON(local.status,function(data){
		if(data.status && data.status.length){
			connected(data);
		}else{
			notConnected();
		}
	});
}
var initTimers = function(){
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
}
var startUpdating = function(){
	return setInterval(function(){
		if(currentConnection){
			$.getJSON(local.speed,function(data){

				let speed = new Number(data.speed);
				desiredSpeed = $("#desiredSpeed").val();
				$("#currSpeed").html(numeral(speed).format(Veload.mphForm) + "mph");
				$("#distance").html(numeral(getDistance()).format(Veload.mphForm) + " miles");
				myChart.data.datasets.forEach((dataset) => {
					dataset.data.push({t:Date.now(),y:speed});
					allPoints.push({t:Date.now(),y:speed});
					if(speed>=desiredSpeed){
						dataset.pointBackgroundColor.push(Veload.good);
						dataset.backgroundColor = Veload.goodBG;
					}else{
						dataset.pointBackgroundColor.push(Veload.bad);
						dataset.backgroundColor = Veload.badBG;
					}
					if(dataset.data.length > (5*120)){
						dataset.data.shift();
						dataset.pointBackgroundColor.shift();
					}
				});
				myChart.update();
				speeds.push(speed);
				$("#avgSpeed").html(numeral(getAvg()).format(Veload.mphForm) + "mph");					
			})
		}
	},Veload.updateFreq);
}
var getAvg = function(){
	return speeds.reduce(function(a,b){
		return a + b
	}, 0) / speeds.length
}
var getDistance = function(){
	return getAvg(speeds) * (elapsed / 60 / 60);
}
var initChart = function(){
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
}

var initVoice = function(){
	if (annyang) {
	// Let's define a command.
		var commands = {
		'start': function() { Veload.start(); },
		'pause': function() { Veload.pause(); },
		'stop': function() { Veload.stop(); },
		'clear': function() { Veload.clear(); }
		};

		// Add our commands to annyang
		annyang.addCommands(commands);

		annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
			$('.speech').text(userSaid);
		});

		// Start listening.
		annyang.start({ autoRestart: true });
	}
}

var notConnected = function(){
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
			poll()
		}
	}
	pop(config,events);
	config = {
		status: `No sensor connection`,
		statusClass: 'bg-warning'
	}
	$('footer').html(cTemps.footer(config));		

}

var connected = function(data){
	currentConnection = data.status;
	const config = {
		status: `veload connected on port ${data.status}`,
		statusClass: 'bg-info'
	}
	if($('#modal').hasClass('disco')){
		$('#modal').modal('hide');
	}
	$('footer').html(cTemps.footer(config));
}
var pop = function(cnf = {}, evt = {}){
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
}

$.fn.loader = function(height=64,width=64){
	$(this).empty().append(`<img src='/img/loading.gif' width='${width}' height='${height} class='img-flex'/>`);
	return this;
}
var error = function(err){
	var config = {
		title: "Error",
		body: `${err}`,
		accept: false,
		close: true,
	}
	console.log(err);
	unpop();
	pop(config);
}
var clear = function(){
	allPoints = [];
	speeds = [];
	timer.reset();
	timer.stop();
	myChart.data.datasets[0].data = []
	myChart.update();
	$("body").removeClass('stoppable');
}
var unpop = function(){
	$('#modal').modal('hide');
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