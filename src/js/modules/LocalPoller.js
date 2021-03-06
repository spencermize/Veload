import _ from 'lodash';
import moment from 'moment';
import { Point } from './Point.js';
import Options from './Options.js';
import { EE } from './EventBus.js';
import { goals } from './Goals.js';

function Poller(){
	this.pollReference = null;
	this.handleEvents();
	this.startPolling(3000);
	if (!(this instanceof Poller)){
		return new Poller();
	}
}

Poller.prototype.poll = function(){
	$.getJSON(Options.urls.local.stats,function(data){
		V.status = data;
		EE.emit('Veload.localInfo');
	}).fail(function(){
		V.status = {};
		EE.emit('Veload.localInfo');
	});
};

Poller.prototype.startUpdating = async function(frequency){
	var geolib = await import('geolib');
	var hrCount = 0;
	var paused = false;
	var missedUpdates = 0;
	self.refresher = setInterval(function(){
		if (V.status.status){
			$.getJSON(Options.urls.local.stats,function(data){
				//expect meters/second
				var speed = Number(Math.max(Number(data.speed),0)).toFixed(6);
				var cad = Math.round(data.cadence);
				var hr = Math.round(data.hr);
				var tempLoc = false;
				var newLoc = false;
				var point = false;

				//if this is the first loop, there will only be one partial point (from the map initialization). kill that point and put a full one in.
				var last = _.last(V.points);
				if (!last.time){
					tempLoc = V.rTrail.shift();
					V.rTrailPopped.push(new Point(tempLoc.latlng.lat,tempLoc.latlng.lng,moment(),hr,cad,speed,false));
					V.points[0] = V.rTrailPopped[0];
				}

				//covered this many meters
				var distance;
				if (!paused){
					//speed point * (time since last update -> seconds)
					distance = speed * (moment().diff(moment(last.time)) / 1000);
				} else if (speed > 0 && paused){
					distance = 0;
					paused = false;
					missedUpdates = 0;
				}

				if (distance && V.rTrail.length){
					while (distance >= V.rTrail[0].distance){
						//set the distance remaining after we get to the new waypoint
						distance = distance - V.rTrail[0].distance;
						tempLoc = V.rTrail.shift();
						V.rTrailPopped.push(new Point(tempLoc.latlng.lat,tempLoc.latlng.lng,moment(),hr,cad,speed,false,goals.getCurrent())); //this is the real trail
						EE.emit('Veload.trueLocationUpdated');
					}
					if (V.rTrail.length == 0){
						//nothing left, we're done!
						EE.emit('Veload.routeCompleted');
					} else {
						V.rTrail[0].distance = V.rTrail[0].distance - distance;

						//this is the estimated trail, for mapping / graphing purposes
						if (tempLoc){ //we pushed a real point, recalibrate
							point = _.last(V.rTrailPopped);
						} else { //we didn't pass a real point so just estimate for the map
							newLoc = geolib.computeDestinationPoint(_.last(V.points),distance,V.rTrail[0].bearing);
							point = new Point(newLoc.latitude,newLoc.longitude,moment(),hr,cad,speed,true,goals.getCurrent(),V.rTrail[0].bearing);
						}
						V.points.push(point);
						EE.emit('Veload.locationUpdated');
					}
				} else if (!distance && V.rTrail.length && missedUpdates < 10){
					//paused?
					missedUpdates += 1;
				}
				if (missedUpdates >= 10){
					paused = true;
				} else {
					if (cad > 0){
						EE.emit('Veload.cadenceUpdated');
					}
					if (speed > 0){
						EE.emit('Veload.speedUpdated');
					}
					if (hrCount % 5 == 0 && hr > 0){
						EE.emit('Veload.hrUpdated');
					}
					hrCount++;
				}
			});
		}
	},frequency);
};

Poller.prototype.startPolling = function(frequency){
	var self = this;
	self.poll();
	self.pollReference = setInterval(function(){ self.poll(); },frequency);
};

Poller.prototype.stopUpdating = function(){
	clearInterval(this.pollReference);
};

Poller.prototype.handleEvents = function(){
	var self = this;
	EE.on('Veload.start',function(){
		self.stopUpdating();
		self.startUpdating(Options.UPDATEFREQ);
	});
	EE.on('Veload.pause',function(){
		self.stopUpdating();
		self.startPolling(3000);
	});
};

export let poll = new Poller();
