var allPoints = [];
var speeds = [];
var ctx = document.getElementById("myChart").getContext('2d');
var myChart, refresher, desiredSpeed, start, elapsed;
var updateFreq = 500;
var mphForm = '0.00';
var good = "#28a745";
var goodBG = "#53F377";
var bad = "#dc3545";
var badBG = "#E27A84";
var timer = new easytimer.Timer();
var athlete = "";
$(document).ready(function(){
	initVoice();
	myChart = initChart();
	initTimers();
	dragula([document.getElementById('main')]);
	$('#modal').modal({show: false});
	$.getJSON("/api/athlete",function(data){
		athlete = data;
		$("#profile").html('<img class="img-fluid" style="max-width:50px" src="' + athlete.profile +'" />');
	});
	$("#strava").on("click",function(e){
		let avg = getAvg();
		let distance = getDistance();
		
		$.post(`/api/publish?elapsed=${elapsed}&distance=${distance}&start=${start}`,function(data){
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
			btn.removeClass("playing");
			timer.pause();
			clearInterval(refresher);
		}else{
			$.getJSON("http://localhost:3001/status",function(data){
				if(data.status && data.status.length){
					btn.addClass("playing")
					start = new Date().toISOString();
					timer.start();
					refresher = startUpdating();
				}else{
					$('#modal').on('show.bs.modal', function (event) {
						var modal = $(this);
						console.log(modal);
						modal.find(".modal-body p").text("Please check that your sensor is connected in the Veload Monitor!");
						modal.find(".modal-header").text("Error!");
						modal.find(".modal-footer .btn-primary").hide();
					}).modal('show');
				}
			});

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
		$.getJSON("http://localhost:3001/speed",function(data){
			if(data.connected){
				$(".footer .status").text(`Veload connected on port ${data.connected}`);
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
			}else{
				$(".footer .status").text("Not connected to bicycle!");
			}		
		})
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
		'	hello': function() { alert('Hello world!'); }
		};

		// Add our commands to annyang
		annyang.addCommands(commands);

		// Start listening.
		annyang.start();
	}
}