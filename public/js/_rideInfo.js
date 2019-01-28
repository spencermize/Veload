Veload.prototype.rideInfo = function(){
	console.log('init ride info');
	var self = this;
	$('[data-ride="carousel"]').carousel();
	$(document).on('locationUpdated.veload',function(){
		if(self.points.length){
			var point = _.last(self.points);
			$("#currSpeed").html(numeral(point.speed).format(self.MPHFORM) + "<br /> mph");
			$("#currCadence").html(numeral(point.cad).format(self.MPHFORM));
			$("#distance").html(numeral(self.getDistance("miles")).format(self.MPHFORM) + "<br /> miles");					
			$("#avgSpeed").html(numeral(self.getAvg("miles")).format(self.MPHFORM) + "<br /> mph");
			$("#hr").text(point.hr);
		}
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
	$(document).trigger('initialized.rideInfo');
}
$(document).trigger('moduleLoaded.rideInfo');