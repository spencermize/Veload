import _ from 'lodash';
import {setColors} from './ColorControls.js';
import 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';
import 'chartjs-plugin-annotation';
import './Gauge.js'
function Charts(){
	console.log('building charts');
	initializeLineCharts();
	initializeGaugeCharts();
	
	$(document).on('clear.veload', function () {
		var chart = $('.grid-item:has([data-chart])');
		chart.each(function(_i,ch){
			var v = $(ch).data('chart')		
			v.data.datasets[0].data = [];
			v.data.datasets[0].pointBackgroundColor = [];
			v.update();
		})
	});
}
function getTypicalLimits(param){
	var lim = [0];
	var max = 0;
	switch(param){
		case "hr" :
			max = 200;
			break;
		case "cad":
			max = 130;
			break;
		case "speed":
			max = 40;
			break;
		default:
			max = 100;
			break;
	}
	for(var i = 0; i<100; i++){
		lim.push(Math.floor(i*(max/100)));
	}
	console.log(lim)
	return lim;
}
function initializeGaugeCharts(){
	var charts = $('[data-chart=gauge]').not(".initialized");
	charts.each(function (_ind, el) {
		console.log('initializing' + el);
		var v = $(el);
		var opts = _.cloneDeep(V.opts.chart.gauge);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		var listen = v.data('listen');
		console.log(`Building ${name}`);
		opts.data.datasets[0].gaugeLimits = getTypicalLimits(param);		
		var chart = new Chart(v, opts);
		v.closest(".grid-item").data('chart', chart);

		setColors();
		chart.update();

		console.log(`setting up ${listen}.veload for ${param}`)
		$(document).on(`${listen}.veload`, function () {
			if (V.points.length) {
				var point = _.last(V.points);
				var p = "";
				if(param=="speed" && V.user.units=="miles"){
					p = V.opts.toBarbarianph(point[param]);
				}else if(param=="speed" && V.user.units=="kilometers"){
					p = V.opts.toKph(point[param]);
				}else{
					p = point[param];
				}
				chart.data.datasets[0].gaugeData.value = p;
				chart.update();				
			}
		})
		console.log(`initialized.${name}`)
		v.addClass("initialized");
		$(document).trigger(`initialized.${name}`);			
	})
}
function initializeLineCharts(){
	var charts = $('[data-chart=line]').not(".initialized");
	charts.each(function (_ind, el) {
		console.log('initializing' + el);
		var v = $(el);
		var opts = _.cloneDeep(V.opts.chart.line);
		var name = v.closest('[data-name]').data('name');
		var params = v.data('param').split(",");
		var listen = v.data('listen').split(",");
		console.log(`Building ${name}`);
		var chart = new Chart(v, opts);

		//hacky workaround to render chart properly
		chart.config.options.scales.xAxes[0].realtime.pause = false;
		chart.update();
		chart.config.options.scales.xAxes[0].realtime.pause = true;
		chart.update()

		v.closest(".grid-item").data('chart', chart);
		params.forEach(function(param,i){
			if(typeof chart.data.datasets[i] == "undefined"){
				console.log("generating datasets...");
				chart.data.datasets[i] = _.cloneDeep(V.opts.chart.line.data.datasets[0]);
			}
			console.log(`setting up ${listen[i]}.veload for ${param}`)
			$(document).on(`${listen[i]}.veload`, function () {
				if (V.points.length) {
					var point = _.last(V.points);
					var p = "";
					if(param=="speed" && V.user.units=="miles"){
						p = V.opts.toBarbarianph(point[param]);
					}else if(param=="speed" && V.user.units=="kilometers"){
						p = V.opts.toKph(point[param]);
					}else{
						p = point[param];
					}
					//console.log(`updating ${name} with x: ${moment(point.time).valueOf()} and y: ${point[param]} `);
					console.log(`${i}: ${p}`)
					chart.data.datasets[i].data.push({ x: moment(point.time).valueOf(), y: p });
					chart.data.datasets[i].pointBackgroundColor.push(V.opts.colors.GOOD);
					if(point.goal && param == point.goal.type){
						chart.options.annotation.annotations[0].value = point.goal.value;
						var col = V.opts.colors.BAD
						if(p>point.goal.value){
							col = V.opts.colors.GOOD;
						}
						chart.options.annotation.annotations[0].borderColor = col;
					}
					//chart.data.datasets[i].backgroundColor = V.opts.colors.GOODBG;
					chart.update();
				}
			});	
		})

		$(document).on('start.veload',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = false;
			})
		});

		$(document).on('pause.veload',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = true;
			});
		});		
		console.log(`initialized.${name}`)
		v.addClass("initialized");
		$(document).trigger(`initialized.${name}`);					
	});
}
export {Charts};