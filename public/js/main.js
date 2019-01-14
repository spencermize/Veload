
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
var ctx = document.getElementById("myChart").getContext('2d');
var myChart, refresher, desiredSpeed, startTime, elapsed;
var updateFreq = 500;
var mphForm = '0.00';
var good = "#28a745";
var goodBG = "#53F377";
var bad = "#dc3545";
var badBG = "#E27A84";
var timer = new easytimer.Timer();
var athlete = "";
const cTemps = [];
var currentConnection = "";
let mod;
$(document).ready(function(){
	initVoice();
	myChart = initChart();
	initTimers();
	poll();
	initPolling();

	var templates = ['modal','footer'];
	templates.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		cTemps[templ] = Handlebars.compile(src);	
	});
	
	dragula([document.getElementById('main')]);
	$('#modal').modal({show: false});
	$.getJSON(remote.athlete,function(data){
		athlete = data;
		$("#profile").html('<img class="img-fluid" style="max-width:50px" src="' + athlete.profile +'" />');
	});
	$("#strava").on("click",function(e){
		let avg = getAvg();
		let distance = getDistance();
		
		$.post(`${remote.api}?elapsed=${elapsed}&distance=${distance}&start=${startTime}`,function(data){
			console.log(data);
		});
	});
	$(".resizable").on("click",function(e){
		var el = $(e.target).closest(".resizable");
		var isMax = el.hasClass("full");
		if(isMax){
			el.removeClass("full col-lg-12").addClass("min col-lg-3")
		}else{
			el.removeClass("min col-lg-3").addClass("full col-lg-12")
		}
		
	});
	$("#control").on("click",function(e){
		var btn = $("#control");
		var playing = btn.hasClass("playing");
		if(playing){
			pause();
		}else{
			if(currentConnection){
				start();
			}else{
				notConnected();
			}

		}
	});
	$("#clear").on("click",function(e){
		allPoints = [];
		speeds = [];
		timer.reset();
		timer.stop();
		myChart.data.datasets[0].data = []
		myChart.update();
	});
});
var initPolling = function(){
	setInterval(function(){
		poll();
	},3000);
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
				$("#currSpeed").html(numeral(speed).format(mphForm) + "mph");
				$("#distance").html(numeral(getDistance()).format(mphForm) + " miles");
				myChart.data.datasets.forEach((dataset) => {
					dataset.data.push({t:Date.now(),y:speed});
					allPoints.push({t:Date.now(),y:speed});
					if(speed>=desiredSpeed){
						dataset.pointBackgroundColor.push(good);
						dataset.backgroundColor = goodBG;
					}else{
						dataset.pointBackgroundColor.push(bad);
						dataset.backgroundColor = badBG;
					}
					if(dataset.data.length > (5*120)){
						dataset.data.shift();
						dataset.pointBackgroundColor.shift();
					}
				});
				myChart.update();
				speeds.push(speed);
				$("#avgSpeed").html(numeral(getAvg()).format(mphForm) + "mph");					
			})
		}
	},updateFreq);
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
	return new Chart(ctx, {
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

var initVoice = function(){
	if (annyang) {
	// Let's define a command.
		var commands = {
		'start': function() { start(); },
		'pause': function() { pause(); }
		};

		// Add our commands to annyang
		annyang.addCommands(commands);

		  // Tell KITT to use annyang
		 // SpeechKITT.annyang();

		  // Define a stylesheet for KITT to use
		 // SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

		  // Render KITT's interface
		  //SpeechKITT.vroom();
		// Start listening.
		annyang.start();
	}
}

var notConnected = function(){
	var config = {
		title: "Error!",
		body: "Please check that your sensor is connected in the Veload Monitor!",
		accept: true,
		close: false,
		backdrop: 'static',
		acceptText: "Retry"
	}
	const events = {
		acceptClick: function(){
			poll()
		}
	}
	pop(config,events);
	config = {
		status: `No sensor connection`,
		statusClass: "text-warning"
	}
	$('footer').html(cTemps.footer(config));		

}

var connected = function(data){
	currentConnection = data.status;
	const config = {
		status: `Veload connected on port ${data.status}`,
		statusClass: "text-success"
	}
	$('#modal').modal('hide');
	$('footer').html(cTemps.footer(config));
}
var pop = function(config,events){
	if(!($("#modal").data('bs.modal') || {})._isShown){
		$('#modal-container').html(cTemps.modal(config));
		$('#modal .btn-cancel').on('click',events.cancelClick);
		$('#modal .btn-accept').on('click',events.acceptClick);
		$('#modal').modal('show');			
	}
}
	
var start = function(){
	const btn = $("#control");
	btn.addClass("playing")
	startTime = new Date().toISOString();
	timer.start();
	refresher = startUpdating();
}

var pause = function(){
	const btn = $("#control");
	btn.removeClass("playing");
	timer.pause();
	clearInterval(refresher);
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