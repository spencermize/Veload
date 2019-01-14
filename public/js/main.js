
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
const Veload = {
	updateFreq: 500,
	mphForm: '0.00',
	good: "#28a745",
	goodBG: "#53F377",
	bad: "#dc3545",
	badBG: "#E27A84"
};

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
	dragula([document.getElementById('main')]);
	
	var templates = ['modal','footer'];
	templates.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		cTemps[templ] = Handlebars.compile(src);	
	});
	
	$.getJSON(remote.athlete,function(data){
		athlete = data;
		$("#profile").html('<img class="img-fluid" style="max-width:50px" src="' + athlete.profile +'" />');
	});
	$(".resizable").on("click",function(e){
		var el = $(e.target).closest(".resizable");
		var isMax = el.hasClass("full");
		if(isMax){
			el.removeClass("full col-lg-6").addClass("min col-lg-3")
		}else{
			el.removeClass("min col-lg-3").addClass("full col-lg-6")
		}
		
	});
	$('body').on('click','button[data-cmd]', function(e){
		let fnc = $(e.target).closest('button[data-cmd]').data('cmd');
		window[fnc]();
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
		'pause': function() { pause(); },
		'stop': function() { stop(); }
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
	
var start = function(){
	$('body').toggleClass('play pause stoppable');
	startTime = new Date().toISOString();
	timer.start();
	refresher = startUpdating();
}

var pause = function(){
	$('body').toggleClass('play pause');
	timer.pause();
	clearInterval(refresher);
}

var stop = function(){
	pause();
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
}

var upload = function(){
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