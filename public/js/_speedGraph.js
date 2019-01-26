Veload.prototype.speedGraph = function(){
	var self = this;
	var name = "speedGraph";
	var el = $(`.${name}`);
	var chart = new Chart(el, _.cloneDeep(this.chartOps));
	el.closest(".grid-item").data('chart',chart);
	$(document).on('vClear',function(){
		chart.data.datasets[0].data = [];
		chart.update();
	});

	$(document).on('locationUpdated.veload',function(){
		var speed = self.speeds[self.speeds.length-1];
		chart.data.datasets.forEach((dataset) => {
			console.log('data speed');
			console.log(dataset)
			dataset.data.push({t:Date.now(),y:speed});

			if(speed>=self.desiredSpeed){
				dataset.pointBackgroundColor.push(self.GOOD);
				dataset.backgroundColor = self.GOODBG;
			}else{
				dataset.pointBackgroundColor.push(self.BAD);
				dataset.backgroundColor = self.BADBG;
			}
			if(dataset.data.length > (5*120)){
				dataset.data.shift();
				dataset.pointBackgroundColor.shift();
			}
		});
		chart.update();				
	});
	$(document).trigger(`initialized.${name}`);		
}
$(document).trigger(`moduleLoaded.${name}`);