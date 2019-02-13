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
                    var cad = Math.round(data.cadence);
                    var hr = Math.round(data.hr); 
                    var tempLoc = false;
                    var newLoc = false;
                    var point = false;                                       

                    // speed point * (time since last update -> seconds)
                    // if this is the first loop, there will only be one partial point (from the map initialization). kill that point and put a full one in.
                    var last = _.last(V.points)
                    if(!last.time){
                        tempLoc = V.rTrail.shift();
                        V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed,false));
                        V.points[0] = V.rTrailPopped[0];
                    }

                    //covered this many meters
                    var distance = speed * (moment().diff(moment(last.time)) / 1000);

                    if (distance && V.rTrail.length) {
                        while (distance >= V.rTrail[0].distance) {
                            //set the distance remaining after we get to the new waypoint
                            distance = distance - V.rTrail[0].distance;
                            tempLoc = V.rTrail.shift();
                            V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed,false)); // this is the real trail
                        }
                        if(V.rTrail.length==0){
                            //nothing left, we're done!
                            $(document).trigger('routeCompleted.veload');
                        }else{
                            V.rTrail[0].distance = V.rTrail[0].distance - distance;
                    
                            //this is the estimated trail, for mapping / graphing purposes
                            if(tempLoc){ //we pushed a real point, recalibrate
                                point = _.last(V.rTrailPopped);
                            }else{ //we didn't pass a real point so just estimate for the map
                                newLoc = geolib.computeDestinationPoint(_.last(V.points), distance, V.rTrail[0].bearing);   
                                point = new Point(newLoc.latitude, newLoc.longitude, moment(), hr, cad, speed,true);
                            }
                            V.points.push(point);
                            console.log(`${V.getDistance('miles')} miles total`)
                            console.log(`${V.getDistance('meters')} meters total`)
                            $(document).trigger('locationUpdated.veload');
                        }                        
                    }
                    if(cad>0){
                        $(document).trigger('cadUpdated.veload');
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