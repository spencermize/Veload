import _ from 'lodash';
import moment from 'moment';
import geolib from 'geolib';
import {Point} from './Point.js';

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
        var paused = false;
        var missedUpdates = 0;
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
      
                    // if this is the first loop, there will only be one partial point (from the map initialization). kill that point and put a full one in.
                    var last = _.last(V.points)
                    if(!last.time){
                        tempLoc = V.rTrail.shift();
                        V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed,false));
                        V.points[0] = V.rTrailPopped[0];
                    }

                    //covered this many meters
                    var distance;
                    if(!paused){
                         // speed point * (time since last update -> seconds)
                        distance = speed * (moment().diff(moment(last.time)) / 1000);
                    }else if(speed>0 && paused){
                        distance = 0;
                        paused = false;
                        missedUpdates = 0;
                    }
                    

                    if (distance && V.rTrail.length) {
                        while (distance >= V.rTrail[0].distance) {
                            //set the distance remaining after we get to the new waypoint
                            distance = distance - V.rTrail[0].distance;
                            tempLoc = V.rTrail.shift();
                            V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed,false,V.Goals.getCurrent())); // this is the real trail
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
                                point = new Point(newLoc.latitude, newLoc.longitude, moment(), hr, cad, speed,true,V.Goals.getCurrent());
                            }
                            V.points.push(point);
                            $(document).trigger('locationUpdated.veload');
                        }                        
                    }else if(!distance && V.rTrail.length && missedUpdates<10){
                        //paused?
                        missedUpdates += 1;
                    }
                    if(missedUpdates>=10){
                        paused = true;
                    }else{
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
                    }

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