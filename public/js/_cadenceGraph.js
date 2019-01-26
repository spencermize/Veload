Veload.prototype.cadenceGraph = function(){
	var self = this;
	var name = "cadenceGraph";
	var el = $(`.${name}`);
	var chart = new Chart(el, _.cloneDeep(this.chartOps));
	el.closest(".grid-item").data('chart',chart);
	$(document).on('vClear',function(){
		chart.data.datasets[0].data = []
		chart.update();
	});
	$(document).on('locationUpdated.veload',function(){
		var cadence = self.cadences[self.cadences.length-1];
		chart.data.datasets.forEach((dataset) => {
			console.log("data cadence");
			console.log(dataset);
			dataset.data.push({t:Date.now(),y:cadence});

			if(dataset.data.length > (5*120)){
				dataset.data.shift();
			}
		});
		chart.update();				
	});
	$(document).trigger(`initialized.${name}`);		
}
$(document).trigger(`moduleLoaded.${name}`);