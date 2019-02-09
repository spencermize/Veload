import _ from 'lodash';
var LocalPoller = {
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
                    var speed = Number(Math.max(new Number(data.speed),0)).toFixed(6);

                    // speed point * (time since last update -> seconds)
                    // if this is the first loop, there will only be one partial point (from the map initialization). kill that point and put a full one in.
                    var last = null;
                    if(V.points.length>1){
                        last = _.last(V.points);
                    }else{
                        last = new Point(V.rTrail[0].latlng.lat, V.rTrail[0].latlng.lng,moment().format(), hr, cad, speed)
                        V.points[0] = last;
                    }

                    //covered this many meters
                    var distance = speed * (moment().diff(moment(last.time)) / 1000);

                    var cad = Math.round(data.cadence);
                    var hr = Math.round(data.hr);
                                        
                   // console.log("traveled " + distance);
                    if (distance && V.rTrail.length) {
                        while (distance >= V.rTrail[0].distance && V.rTrail.length>1) {
                           // console.log("Change up!");
                            //change direction
                            //set the distance remaining after we get to the new waypoint
                            distance = distance - V.rTrail[0].distance;

                            //bump us to the next waypoint
                            V.points.push(new Point(V.rTrail[0].latlng.lat, V.rTrail[0].latlng.lng,moment().format(), hr, cad, speed));

                            //then, ditch the old waypoint
                            V.rTrailPopped = V.rTrail.shift();
                            _.last(V.rTrailPopped.time = moment().format())
                        }
                      //  console.log(V.rTrail[0].distance + " remaining until waypoint");
                        V.rTrail[0].distance = V.rTrail[0].distance - distance;
                    
                        var newLoc = geolib.computeDestinationPoint(_.last(V.points), distance, V.rTrail[0].bearing);
                        var point = new Point(newLoc.latitude, newLoc.longitude, moment().format(), hr, cad, speed);
                       // console.log(point);
                        V.points.push(point);
                        if(V.rTrail.length==1 && V.rTrail[0].distance<=0){
                            //nothing left, we're done!
                            $(document).trigger('routeCompleted.veload');
                        }                        
                        $(document).trigger('locationUpdated.veload');
                    }
                    if(cad>0){
                        $(document).trigger('cadenceUpdated.veload');
                    }
                    if(speed>0){
                        $(document).trigger('speedUpdated.veload');
                    }
                    if (hrCount % 5 == 0 && hr>0) {
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