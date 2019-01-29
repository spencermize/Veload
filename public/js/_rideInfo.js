function RideInfo() {
  console.log('init ride info');
  V.rideRoller();

  $(document).trigger('initialized.rideInfo');
}
$(document).trigger('moduleLoaded.rideInfo');

Veload.prototype.rideRoller = function(){
  var self = this;
  $(document).on('locationUpdated.veload', function () {
    if (self.points.length) {
      var point = _.last(V.points);
      $("#currSpeed").html(numeral(point.speed).format(V.MPHFORM) + "<br /> mph");
      $("#currCadence").html(numeral(point.cad).format(V.MPHFORM));
      $("#distance").html(numeral(V.getDistance("miles")).format(V.MPHFORM) + "<br /> miles");
      $("#avgSpeed").html(numeral(V.getAvg("miles")).format(V.MPHFORM) + "<br /> mph");
      $("#hr").text(point.hr);
    }
  });

  V.timer.addEventListener('secondsUpdated', function (e) {
    $('#elapsedTime').html(self.timer.getTimeValues().toString());
  });
  V.timer.addEventListener('started', function (e) {
    $('#elapsedTime').html(self.timer.getTimeValues().toString());
  });
  V.timer.addEventListener('reset', function (e) {
    $('#elapsedTime').html(self.timer.getTimeValues().toString());
  });
}