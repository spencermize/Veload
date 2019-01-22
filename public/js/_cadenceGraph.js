document.addEventListener('veloaded',function(){
	Veload.prototype.cadenceGraph = function(){
		var self = this;
		var el = $('.cadenceGraph');
		var chart = new Chart(el, this.chartOps);
		el.data('chart',chart);
		$(document).on('vClear',function(){
			chart.data.datasets[0].data = []
			chart.update();
		});
		$(document).on('vUpdated',function(){
			var cadence = self.cadences[self.cadences.length-1];
			var chart = $('.cadenceGraph').data('chart');
			chart.data.datasets.forEach((dataset) => {
				console.log(dataset);
				dataset.data.push({t:Date.now(),y:cadence});

				if(dataset.data.length > (5*120)){
					dataset.data.shift();
				}
			});
			chart.update();				
		});
	}
	$(document).trigger('cadenceGraphLoaded');
});