let LocalPoller = {
    poll: function() {
        $.getJSON(V.opts.urls.local.stats, function (data) {
            V.status = data;
            $(document).trigger('localInfo.veload');
        })
        .fail(function(){
            V.status = {};
            $(document).trigger('localInfo.veload');
        });
    },

    startUpdating: function() {
        var hrCount = 0;

        return setInterval(function () {
            if (V.status.status) {
                $.getJSON(V.opts.urls.local.stats, function (data) {
                    //expect meters/second
                    var metSpeed = Math.max(new Number(data.speed),0);

                    // m/s -> mph (TODO: get rid of magic numbers)
                    var speed = metSpeed * 2.23694;

                    // speed point * (time since last update -> seconds)
                    var last = _.last(V.points)
                    var distance = metSpeed * (moment().diff(moment(last.time)) / 1000);

                    var cad = data.cadence;
                    var hr = data.hr;
                                        
                   // console.log("traveled " + distance);
                    if (distance && V.rTrail.length) {
                        while (distance > V.rTrail[0].distance) {
                           // console.log("Change up!");
                            //change direction
                            //first, just bump us to the next waypoint
                            V.points.push(new Point(V.rTrail[1].latlng.lat, V.rTrail[1].latlng.lng,moment().format(), hr, cad, speed));
                            //then, set the distance remaining after we get to the new waypoint
                            distance = distance - V.rTrail[0].distance;
                            //then, ditch the old waypoint
                            V.rTrail.shift();
                        }

                        V.rTrail[0].distance = V.rTrail[0].distance - distance;
                      //  console.log(V.rTrail[0].distance + " remaining until waypoint");
                        var newLoc = geolib.computeDestinationPoint(last, distance, V.rTrail[0].bearing);
                        var point = new Point(newLoc.latitude, newLoc.longitude, moment().format(), hr, cad, speed);
                       // console.log(point);
                        V.points.push(point);
                    } else {
                        if (V.points.length) {
                            V.points.push(new Point(last.lat, last.lng, moment().format(), last.hr, 0, 0));
                        }
                    }
                    $(document).trigger('locationUpdated.veload');
                    if (hrCount % 15 == 0) {
                        $(document).trigger('hrUpdated.veload');
                    }
                    hrCount++;
                })
                
            }
        }, V.opts.UPDATEFREQ);
    },
    stopUpdating: function(){
        clearInterval(V.refresher);
    },
    startPolling: function(frequency){
        V.poll = setInterval(function(){LocalPoller.poll()},frequency);
    },
    stopPolling: function(){
        clearInterval(V.poll);
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