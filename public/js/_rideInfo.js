document.addEventListener('veloaded',function(){
	Veload.prototype.rideInfo = function(){
		console.log('init ride info');
		var self = this;
		$(document).on('vUpdated',function(){
			$("#currSpeed").html(numeral(self.speeds[self.speeds.length-1]).format(self.MPHFORM) + " mph");
			$("#distance").html(numeral(self.getDistance()).format(self.MPHFORM) + " miles");					
			$("#avgSpeed").html(numeral(self.getAvg()).format(self.MPHFORM) + " mph");
		});
		
		self.timer.addEventListener('secondsUpdated', function (e) {
			$('#elapsedTime').html(self.timer.getTimeValues().toString());
		});
		self.timer.addEventListener('started', function (e) {
			$('#elapsedTime').html(self.timer.getTimeValues().toString());
		});
		self.timer.addEventListener('reset', function (e) {
			$('#elapsedTime').html(self.timer.getTimeValues().toString());
		});		
	}
	$(document).trigger('rideInfoLoaded');
});