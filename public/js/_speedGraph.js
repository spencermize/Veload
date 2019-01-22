document.addEventListener('veloaded',function(){
	Veload.prototype.speedGraph = function(){
		var self = this;
		var el = $('.speedGraph');
		var chart = new Chart(el[0].getContext('2d'), this.chartOps);
		$(document).on('vClear',function(){
			chart.data.datasets[0].data = []
			chart.update();
		});
		$(document).on('vUpdated',function(){
			var speed = self.speeds[self.speeds.length-1];
			chart.data.datasets.forEach((dataset) => {
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
	}
	$(document).trigger('speedGraphLoaded');
});