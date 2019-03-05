import _ from 'lodash';
import setColors from './ColorControls.js';
import { EE } from './EventBus.js';
import moment from 'moment';
import Options from './Options.js';

EE.once('Veload.loaded',Charts);
async function Charts(){
	if ($('[data-chart]').length){
		await import('chart.js');
		await import('chartjs-plugin-streaming');
		await import('chartjs-plugin-zoom');
		await import('chartjs-plugin-annotation');
		await import('./Gauge.js');

		initializeLineCharts();
		initializeGaugeCharts();
	}

	EE.on('Veload.clear',function(){
		var chart = $('.grid-item:has([data-chart])');
		chart.each(function(_i,ch){
			var v = $(ch).data('chart');
			v.data.datasets[0].data = [];
			v.data.datasets[0].pointBackgroundColor = [];
			v.update();
		});
	});
}
function getTypicalLimits(param){
	var lim = [0];
	var max = 0;
	switch (param){
	case 'hr' :
		max = 200;
		break;
	case 'cad':
		max = 130;
		break;
	case 'speed':
		max = 40;
		break;
	default:
		max = 100;
		break;
	}
	for (var i = 0; i < 100; i++){
		lim.push(Math.floor(i * (max / 100)));
	}
	return lim;
}
function initializeGaugeCharts(){
	var charts = $('[data-chart=gauge]').not('.initialized');
	charts.each(function(_ind,el){
		var v = $(el);
		var opts = _.cloneDeep(Options.chart.gauge);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		var listen = v.data('listen');
		opts.data.datasets[0].gaugeLimits = getTypicalLimits(param);
		var chart = new Chart(v,opts);
		v.closest('.grid-item').data('chart',chart);

		setColors();
		chart.update();

		EE.on(`Veload.${listen}`,function(){
			if (V.points.length){
				var point = _.last(V.points);
				var p = '';
				if (param == 'speed' && V.user.units == 'miles'){
					p = Number(Options.toBarbarianph(point[param])).toFixed(2);
				} else if (param == 'speed' && V.user.units == 'kilometers'){
					p = Number(Options.toKph(point[param])).toFixed(2);
				} else {
					p = point[param];
				}
				chart.data.datasets[0].gaugeData.value = p;
				if (point.goal && param == point.goal.type){
					chart.data.datasets[0].goal = point.goal.value;
					var col = Options.colors.BAD;
					if (p > point.goal.value){
						col = Options.colors.GOOD;
					}
					chart.data.datasets[0].color = col;
				}

				chart.update();
			}
		});
		v.addClass('initialized');
		EE.emit(`${_.capitalize(name)}.initialized.`);
	});
}
function initializeLineCharts(){
	var charts = $('[data-chart=line]').not('.initialized');
	charts.each(function(_ind,el){
		var v = $(el);
		var opts = _.cloneDeep(Options.chart.line);
		var name = v.closest('[data-name]').data('name');
		var params = v.data('param').split(',');
		var listen = v.data('listen').split(',');
		var chart = new Chart(v,opts);

		//hacky workaround to render chart properly
		chart.config.options.scales.xAxes[0].realtime.pause = false;
		chart.update();
		chart.config.options.scales.xAxes[0].realtime.pause = true;
		chart.update();

		v.closest('.grid-item').data('chart',chart);
		params.forEach(function(param,i){
			if (typeof chart.data.datasets[i] == 'undefined'){
				chart.data.datasets[i] = _.cloneDeep(Options.chart.line.data.datasets[0]);
			}
			EE.on(`Veload.${listen[i]}`,function(){
				if (V.points.length){
					var point = _.last(V.points);
					var p = '';
					if (param == 'speed' && V.user.units == 'miles'){
						p = Options.toBarbarianph(point[param]);
					} else if (param == 'speed' && V.user.units == 'kilometers'){
						p = Options.toKph(point[param]);
					} else {
						p = point[param];
					}
					chart.data.datasets[i].data.push({ x: moment(point.time).valueOf(),y: p });
					chart.data.datasets[i].pointBackgroundColor.push(Options.colors.GOOD);
					if (point.goal && param == point.goal.type){
						chart.options.annotation.annotations[0].value = point.goal.value;
						var col = Options.colors.BAD;
						if (p > point.goal.value){
							col = Options.colors.GOOD;
						}
						chart.options.annotation.annotations[0].borderColor = col;
					}
					//chart.data.datasets[i].backgroundColor = Options.colors.GOODBG;
					chart.update();
				}
			});
		});

		EE.on('Veload.start',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = false;
			});
		});

		EE.on('Veload.pause',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = true;
			});
		});
		v.addClass('initialized');
		EE.emit(`${_.capitalize(name)}.initialized`);
	});
}
export { Charts };
