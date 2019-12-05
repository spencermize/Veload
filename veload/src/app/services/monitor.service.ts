import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Moment } from 'moment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';
import { OptionsService } from './options.service';
import { StatsService } from './models/stats.service'

@Injectable({
	providedIn: 'root'
})
export class MonitorService {
	private pollReference = null;
	private active: boolean = false;
	private refresher = null;
	private trigger$ = interval(3000);
	public polling$: BehaviorSubject<boolean> = new BehaviorSubject(false);
	public stats$: BehaviorSubject<StatsService> = new BehaviorSubject(null);
	constructor(public options: OptionsService, private http: HttpClient) {
		this.handleEvents();

		this.trigger$.subscribe( () => this.poll())
	}

	private poll() {
		this.http.get(this.options.get('urls').local.stats).subscribe((data: StatsService) => {
			this.stats$.next(data);
		})
	};

	private async startUpdating(frequency) {
		var geolib = await import('geolib');
		var hrCount = 0;
		var paused = false;
		var missedUpdates = 0;
		this.refresher = setInterval(function () {
			if (V.status.status) {
				$.getJSON(Options.urls.local.stats, function (data) {
					//expect meters/second
					var speed = Number(Math.max(Number(data.speed), 0)).toFixed(6);
					var cad = Math.round(data.cadence);
					var hr = Math.round(data.hr);
					var tempLoc = false;
					var newLoc = false;
					var point = false;

					//if this is the first loop, there will only be one partial point (from the map initialization). kill that point and put a full one in.
					var last = _.last(V.points);
					if (!last.time) {
						tempLoc = V.rTrail.shift();
						V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed, false));
						V.points[0] = V.rTrailPopped[0];
					}

					//covered this many meters
					var distance;
					if (!paused) {
						//speed point * (time since last update -> seconds)
						distance = speed * (moment().diff(moment(last.time)) / 1000);
					} else if (speed > 0 && paused) {
						distance = 0;
						paused = false;
						missedUpdates = 0;
					}

					if (distance && V.rTrail.length) {
						while (distance >= V.rTrail[0].distance) {
							//set the distance remaining after we get to the new waypoint
							distance = distance - V.rTrail[0].distance;
							tempLoc = V.rTrail.shift();
							V.rTrailPopped.push(new Point(tempLoc.latlng.lat, tempLoc.latlng.lng, moment(), hr, cad, speed, false, goals.getCurrent())); //this is the real trail
							EE.emit('Veload.trueLocationUpdated');
						}
						if (V.rTrail.length == 0) {
							//nothing left, we're done!
							EE.emit('Veload.routeCompleted');
						} else {
							V.rTrail[0].distance = V.rTrail[0].distance - distance;

							//this is the estimated trail, for mapping / graphing purposes
							if (tempLoc) { //we pushed a real point, recalibrate
								point = _.last(V.rTrailPopped);
							} else { //we didn't pass a real point so just estimate for the map
								newLoc = geolib.computeDestinationPoint(_.last(V.points), distance, V.rTrail[0].bearing);
								point = new Point(newLoc.latitude, newLoc.longitude, moment(), hr, cad, speed, true, goals.getCurrent(), V.rTrail[0].bearing);
							}
							V.points.push(point);
							EE.emit('Veload.locationUpdated');
						}
					} else if (!distance && V.rTrail.length && missedUpdates < 10) {
						//paused?
						missedUpdates += 1;
					}
					if (missedUpdates >= 10) {
						paused = true;
					} else {
						if (cad > 0) {
							EE.emit('Veload.cadenceUpdated');
						}
						if (speed > 0) {
							EE.emit('Veload.speedUpdated');
						}
						if (hrCount % 5 == 0 && hr > 0) {
							EE.emit('Veload.hrUpdated');
						}
						hrCount++;
					}
				});
			}
		}, frequency);
	};

	private startPolling(frequency) {
		var self = this;
		self.poll();
		self.pollReference = setInterval(function () { self.poll(); }, frequency);
	};

	private stopUpdating() {
		clearInterval(this.pollReference);
	};

	private handleEvents() {
		var self = this;
		EE.on('Veload.start', function () {
			self.stopUpdating();
			self.startUpdating(Options.UPDATEFREQ);
		});
		EE.on('Veload.pause', function () {
			self.stopUpdating();
			self.startPolling(3000);
		});
	};

}
