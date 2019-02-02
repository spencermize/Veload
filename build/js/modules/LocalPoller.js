let LocalPoller = {
    poll: function() {
        $.getJSON(V.opts.urls.local.stats, function (data) {
            V.status = data;
            $(document).trigger('connectionInfo.veload', data);
        })
        .fail(function(){
            V.status = {};
            $(document).trigger('connectionInfo.veload');
        });
    },

    startUpdating: function() {
        var hrCount = 0;

        return setInterval(function () {
            if (V.currentConnection) {
                $.getJSON(V.opts.urls.local.stats, function (data) {
                    //expect meters/second
                    var metSpeed = Math.max(new Number(data.speed),0);

                    // m/s -> mph (TODO: get rid of magic numbers)
                    var speed = metSpeed * 2.23694;

                    // speed point * (time since last update -> seconds)
                    var last = _.last(V.points)
                    var distance = metSpeed * (moment().diff(moment(last.time)) / 1000);
                   // console.log("traveled " + distance);
                    if (distance && V.rTrail.length) {
                        while (distance > V.rTrail[0].distance) {
                           // console.log("Change up!");
                            //change direction
                            //first, just bump us to the next waypoint
                            V.points.push(new Point(V.rTrail[1].latlng.lat, V.rTrail[1].latlng.lng));
                            //then, set the distance remaining after we get to the new waypoint
                            distance = distance - V.rTrail[0].distance;
                            //then, ditch the old waypoint
                            V.rTrail.shift();
                        }

                        V.rTrail[0].distance = V.rTrail[0].distance - distance;
                      //  console.log(V.rTrail[0].distance + " remaining until waypoint");
                        var newLoc = geolib.computeDestinationPoint(last, distance, V.rTrail[0].bearing);
                        var cad = data.cadence;
                        var sp = speed;
                        var hr = data.hr;
                        var point = new Point(newLoc.latitude, newLoc.longitude, moment().format(), hr, cad, sp);
                       // console.log(point);
                        V.points.push(point);
                    } else {
                        if (V.points.length) {
                            V.points.push(new Point(_.last(V.points).lat, _.last(V.points).lng, moment().format(), _.last(V.points).hr, 0, 0));
                        }
                    }
                    $(document).trigger('locationUpdated.veload');
                    if (hrCount % 15 == 0) {
                        $(document).trigger('hrUpdated.veload');
                    }
                    hrCount++;
                    $(document).trigger('connectionInfo.veload', data);
                })
                
            }
        }, V.opts.UPDATEFREQ);
    },
    stopUpdating: function(){
        clearInterval(V.refresher);
    },
    startPolling: function(frequency){
        V.poller = setInterval(function(){LocalPoller.poll()},frequency);
    },
    stopPolling: function(){
        clearInterval(V.poller);
    },
    handleEvents: function(){
        $(document).on("start.veload",function(){
            LocalPoller.stopPolling()
            V.refresher = LocalPoller.startUpdating();
        })
        $(document).on("pause.veload",function(){
            LocalPoller.startPolling(3000)
            V.refresher = LocalPoller.stopUpdating();
        })        
    }
}

export {LocalPoller};