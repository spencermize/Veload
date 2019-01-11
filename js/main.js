var allPoints = [];
var speeds = [];
var ctx = document.getElementById("myChart").getContext('2d');
var myChart, refresher, desiredSpeed;
var updateFreq = 500;
var mphForm = '0.00';
var good = "#28a745";
var goodBG = "#53F377";
var bad = "#dc3545";
var badBG = "#E27A84";
var timer = new easytimer.Timer();
$(document).ready(function(){
	myChart = initChart();
	initTimers();
	dragula([document.getElementById('main')]);
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
			btn.addClass("playing")
			timer.start();
			refresher = startUpdating();
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
		$.getJSON("/api/speed",function(data){
			desiredSpeed = $("#desiredSpeed").val();
			$("#currSpeed").html(numeral(data).format(mphForm) + "mph");
			myChart.data.datasets.forEach((dataset) => {
				dataset.data.push({t:Date.now(),y:data});
				if(data>=desiredSpeed){
					dataset.pointBackgroundColor.push(good);
					dataset.backgroundColor = goodBG;
				}else{
					dataset.pointBackgroundColor.push(bad);
					dataset.backgroundColor = badBG;
				}
				if(dataset.data.length > (5*120)){
					allPoints.push(dataset.data.shift());
				}
			});
			myChart.update();
			speeds.push(data);
			$("#avgSpeed").html(numeral(getAvg(speeds)).format(mphForm) + "mph");			
		})
	},updateFreq);
}
var getAvg = function(sp){
	return sp.reduce(function(a,b){
		return a + b
	}, 0) / sp.length
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