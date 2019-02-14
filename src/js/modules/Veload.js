'use strict';

window.$ = $;
import _ from 'lodash';
import moment from 'moment';
import 'bootstrap';
import '../../third_party/gridster/jquery.gridster.min.js';
import * as L from 'leaflet'
import List from 'list.js';
import omni from '@mapbox/leaflet-omnivore';
import ico from '@ansur/leaflet-pulse-icon';
import '../../../node_modules/leaflet-providers/leaflet-providers.js';
import geolib from 'geolib';
import Timer from 'easytimer.js';
import {Point} from './Point.js';

window.Handlebars = Handlebars;
window.moment = moment;
window.L = L;
window.List = List;
window.omni = omni;
window.ico = ico;
window.geolib = geolib;
window.Timer = Timer;
window.Point = Point;

["rTrail", "cTemps", "enabledMods", "modLoadQueue", "points", "rTrailPopped"].forEach(function (e) {
	Veload.prototype[e] = [];
});

["user","status","athlete", "refresher", "$grid", "myIcon", "photos"].forEach(function (e) {
	Veload.prototype[e] = "";
});


function Veload(opts) {
	this.opts = opts;
	this.status = {};
	if (!(this instanceof Veload)) return new Veload(opts);
}

Veload.prototype.listenForFinish = function (finishedEvent) {
	self.modLoadQueue.push(finishedEvent);
	$(document).one(finishedEvent, function () {
		console.log(finishedEvent);
		_.pull(self.modLoadQueue, finishedEvent);
		//console.log(self.modLoadQueue);
		if (self.modLoadQueue.length == 0) {
			$(document).trigger('modulesLoaded.veload');
			console.log('modulesLoaded.veload');
		}
	});
}
Veload.prototype.start = function () {
	var self = this;
	if(self.points.length){
		var config = {
			title: "waiting for sensors to connect",
			overClass: "bigButtons",
			content: self.cTemps['buttons']()
		}
		var over = $(self.cTemps['overlay'](config));
		var b = $('body').append(over);

		var connected = setInterval(function(){self.sensorsConnected(self)},500);
		$(document).on('sensorsConnected.veload',function(){
			clearInterval(connected);
			over.remove();
			b.addClass('playing stoppable').removeClass('paused');
		
			self.timer.start();
			$(document).trigger("start.veload");			
		})
	}else{
		V.pickTrackGUI();
		$(document).one("trackLoaded.veload",function(){
			V.start();
		})
	}
}
Veload.prototype.sensorsConnected = function(self){
	var desired = [self.user.hr,self.user.cadence,self.user.speed];
	var connected = [self.status.sensors.hr,self.status.sensors.cadence,self.status.sensors.speed];
	if(_.isEqual(desired,connected)){
		console.log('connected...');
		$(document).trigger('sensorsConnected.veload');
	}
}
Veload.prototype.pause = function () {
	var self = this;
	$('body').removeClass('playing');
	$('body').addClass('paused');
	self.timer.pause();
	$(document).trigger("pause.veload");
}
Veload.prototype.stop = function () {
	var self = this;
	self.pause();
	if (self.points.length) {
		var config = {
			title: "End ride?",
			body: "Are you sure you want to end this ride and upload to Strava?",
			accept: true,
			close: true,
			acceptText: "Finish",
			cancelText: "Go back"
		}
		const events = {
			acceptClick: function () {
				self.upload();
			}
		}
		self.pop(config, events);
	}
	$(document).trigger("stop.veload");
}
Veload.prototype.clear = function () {
	self = this;
	self.pause();
	var config = {
		title: "Clear this ride?",
		body: "Are you sure you want to clear your ride? You will lose all data in this window.",
		accept: true,
		close: true,
		acceptText: "Clear",
		acceptClass: "btn-danger",
		cancelText: "Go back"
	}
	const events = {
		acceptClick: function () {
			self.points = [];
			self.rTrailPopped = []
			self.timer.reset();
			$("body").removeClass('stoppable');
			self.unpop();
			$(document).trigger("clear.veload");
		}
	}
	self.pop(config, events);
}

Veload.prototype.upload = function () {
	var self = this;
	$('.modal-footer').loader(36, 36, true);
	self.rTrailPopped.forEach(function(val,i){
		self.rTrailPopped[i].time = moment(val.time).format();
	});
	$.post(self.opts.urls.remote.publish, { points: self.rTrailPopped }, function (data) {
		if (data.id) {
			var config = {
				title: "Congrats!",
				body: "Congratulations, your ride has been uploaded!",
				accept: false,
				close: true,
				cancelText: "Finish"
			}
			$('#modal').on('hidden.bs.modal', function () {
				self.pop(config);
			});
			self.unpop();
		} else {
			self.error("Error uploading to Strava");
		}
	}).fail(function (err) {
		console.log(err);
		self.error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${self.remote.publish}) responded (${err.status} ${err.statusText}) <br /> ${query}</p>`);
	});
}
Veload.prototype.error = function (err) {
	var config = {
		title: "Error",
		body: `${err}`,
		accept: false,
		close: true,
	}
	console.log(err);
	this.unpop();
	this.pop(config);
}

Veload.prototype.fullscreen = function (config) {
	if (config.caller != "voice") {
		$('body')[0].requestFullscreen();
	}
}

Veload.prototype.getAvg = function (unit) {
	var self = this;
	if(self.rTrailPopped.length>=2){
		var d = self.getDistance(unit) 
		var t = moment(_.last(self.rTrailPopped).time).diff(moment(self.rTrailPopped[0].time)) / 1000 / 3600;
		return d / t
	}else{
		return 0;
	}

}
Veload.prototype.getDistance = function (unit) {
	var self = this;
	var dm = geolib.getPathLength(self.rTrailPopped);
	if (unit == "miles") {
		return geolib.convertUnit("mi",dm,8);
	} else if (unit == "meters") {
		return dm;
	} else if (unit == "kilometers"){
		return geolib.convertUnit("km",dm,8);
	}
}
Veload.prototype.loading = function () {
	$('body').addClass('loading');
}

//===============HELPERS===================
$.fn.loader = function (height = 64, width = 64, clear = false) {
	if (clear) {
		$(this).empty();
	}
	$(this).append(loadAni(height, width));
	return this;
}
function loadAni(height = 64, width = 64) {
	return `<span style='height:${height}px;width:${width}px' class='spin'/>`;
}
$.fn.cleanWhitespace = function () {
	this.contents().filter(
		function () { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
		.remove();
	return this;
}

export {Veload};