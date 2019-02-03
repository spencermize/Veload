function RideInfo() {
  console.log('init ride info');
  V.rideRoller();

  $(document).trigger('initialized.rideInfo');
}
$(document).trigger('moduleLoaded.rideInfo');

V.rideRoller = function(){
  var self = this;
  $(document).on('locationUpdated.veload', function () {
    if (self.points.length) {
      var point = _.last(V.points);
      var per = V.user.units == "miles" ? "mph" : "kph";
      $(".active #currSpeed").html(`${numeral(point.speed).format(V.NUMFORM)}<br /> ${per}`);
      $(".active #currCadence").html(numeral(point.cad).format(V.NUMFORM));
      $(".active #distance").html(`${numeral(V.getDistance(V.user.units)).format(V.NUMFORM)}<br /> ${V.user.units}`);
      $(".active #avgSpeed").html(`${numeral(V.getAvg(V.user.units)).format(V.NUMFORM)}<br />${V.user.units}`);

    }
    $(document).on('hrUpdated.veload', function () {
      $(".active #hr").text(point.hr);
    })
  });

  V.timer.addEventListener('secondsUpdated', function (e) {
    $('.active #elapsedTime').html(self.timer.getTimeValues().toString());
  });
  V.timer.addEventListener('started', function (e) {
    $('.active #elapsedTime').html(self.timer.getTimeValues().toString());
  });
  V.timer.addEventListener('reset', function (e) {
    $('.active #elapsedTime').html(self.timer.getTimeValues().toString());
  });
}