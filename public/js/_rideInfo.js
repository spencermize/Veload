function RideInfo() {
  console.log('init ride info');
  V.rideRoller();

  $(document).trigger('initialized.rideInfo');
}
$(document).trigger('moduleLoaded.rideInfo');

V.rideRoller = function(){
  var self = this;
  $(document).on('speedUpdated.veload', function () {
    var point = V.points[V.points.length-1];
    var per = "";
    var speed = 0;
    
    if(V.user.units=="miles"){
      var per = "mph";
      speed = V.opts.toBarbarianph(point.speed);

    }else{
      var per = "kph";
      speed = V.opts.toKph(point.speed);
    }
    $("#currSpeed").html(`${Number(speed).toFixed(2)}<br />${per}`);
    $("#distance").html(`${Number(V.getDistance(V.user.units)).toFixed(2)}<br />${V.user.units}`);
    $("#avgSpeed").html(`${Number(V.getAvg(V.user.units)).toFixed(2)}<br />${per}`);
  })
  $(document).on('cadenceUpdated.veload', function () {
    var point = V.points[V.points.length-1];
    $("#currCadence").text(Number(point.cad).toFixed(0));
  })
  $(document).on('hrUpdated.veload', function () {
    var point = V.points[V.points.length-1];
    $("#hr").text(Number(point.hr).toFixed(0));
  })
  $(document).on('clear.veload', function () {
    $("#currSpeed,#distance,#avgSpeed,#hr,#currCadence").html('');
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