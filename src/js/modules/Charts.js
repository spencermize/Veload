import _ from 'lodash';
function Charts(){
	console.log('building charts');
	var charts = $('[data-chart]');
	charts.each(function (_ind, el) {
		console.log('initializing' + el);
		var v = $(el);
		var opts = _.cloneDeep(V.opts.chart);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		console.log(`Building ${name}`);
		opts.type = v.data('chart');
		var chart = new Chart(v, opts);

		//hacky workaround to render chart properly
		chart.config.options.scales.xAxes[0].realtime.pause = false;
		chart.update();
		chart.config.options.scales.xAxes[0].realtime.pause = true;
		chart.update()

		v.closest(".grid-item").data('chart', chart);

		$(document).on(`${v.data('listen')}.veload`, function () {
			if (V.points.length) {
				var point = _.last(V.points);
				console.log(`updating ${name} with x: ${moment(point.time).valueOf()} and y: ${point[param]} `);
				chart.data.datasets[0].data.push({ x: moment(point.time).valueOf(), y: point[param] });
				chart.data.datasets[0].pointBackgroundColor.push(V.GOOD);
				chart.data.datasets[0].backgroundColor = V.GOODBG;
				chart.update({ preservation: true });
			}
		});	
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
		$(document).trigger(`initialized.${name}`);					
	});
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

export {Charts};