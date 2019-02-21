function RideInfo() {
  console.log('init ride info');
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
    $("#distance").html(`${Number(V.getDistance(V.user.units,true)).toFixed(2)}<br />${V.user.units}`);
    $("#rdistance").html(`${Number(V.getRemainingDistance(V.user.units)).toFixed(2)}<br />${V.user.units}`);
    $("#avgSpeed").html(`${Number(V.getAvg(V.user.units)).toFixed(2)}<br />${per}`);
  })
  $(document).on('cadUpdated.veload', function () {
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
  $(document).on('locationUpdated.veload',function (e) {
    $('#elapsedTime').html(new Date(V.getElapsed() * 1000).toISOString().substr(11, 8)); // clock time
  });
  $(document).trigger('initialized.rideInfo');
}
$(document).trigger('moduleLoaded.rideInfo');