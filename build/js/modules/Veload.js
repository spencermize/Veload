'use strict';

window.jQuery = $;
window.$ = $;
window._ = _;
import moment from 'moment';
import Chart from 'chart.js';
import 'chartjs-plugin-streaming';
import 'chartjs-plugin-zoom';
import 'bootstrap';
import '../../third_party/gridster/jquery.gridster.min.js';
import L from 'leaflet';
import numeral from 'numeral';
import List from 'list.js';
import omni from '@mapbox/leaflet-omnivore';
import ico from '@ansur/leaflet-pulse-icon';
import geolib from 'geolib';
import Timer from 'easytimer.js';
import {Point} from './Point.js';

window.Handlebars = Handlebars;
window.moment = moment;
window.Chart = Chart;
window.L = L;
window.List = List;
window.omni = omni;
window.numeral = numeral;
window.ico = ico;
window.geolib = geolib;
window.Timer = Timer;
window.Point = Point;

["rTrail", "cTemps", "enabledMods", "modLoadQueue", "points"].forEach(function (e) {
	Veload.prototype[e] = [];
});

["currentConnection", "athlete", "refresher", "desiredSpeed", "elapsed", "$grid", "myIcon", "photos"].forEach(function (e) {
	Veload.prototype[e] = "";
});


function Veload(opts) {
	this.opts = opts;
	this.status = {};
	if (!(this instanceof Veload)) return new Veload(opts);
}

Veload.prototype.moduleToggle = function (e) {
	var e = $(e);
	var el = e.closest('[data-name]').data("name");
	if (e.closest('.btn-toggle').hasClass("active")) {
		self.enableModule(el);
		self.loaded();
	} else {
		self.disableModule(el);
	}
}
Veload.prototype.disableModule = function (mod) {
	var el = $(`.grid-item[data-name=${mod}]`);
	if(el.length){
		el.fadeOut(400, function () {
			_.pull(self.enabledMods, mod);
			$('.grid').data('grid').remove_widget(el);
			self.saveLayout();
		})
	}else{
		_.pull(self.enabledMods, mod);
	}

}

Veload.prototype.enableModule = function (mod, cnf) {
	if(mod){
		console.log(`enabling ${mod}`);
		V.enabledMods.push(mod);
		const config = Object.assign({
			size_x: 1,
			size_y: 1,
			col: 1,
			row: 1
		}, cnf);
		var name = mod + "-module";
		var el = document.getElementById(name);
		if(el){
			var src = el.innerHTML;
			var comp = Handlebars.compile(src)();

			var finishedEvent = `initialized.${mod}`;

			console.log("waiting for " + finishedEvent);
			self.listenForFinish(finishedEvent);
			$('.grid').data('grid').add_widget(src, config.size_x, config.size_y, config.col, config.row);
		
			if($(`[data-name=${mod}]`).data("script")){
				$.getScript(`/js/_${mod}.js`, function () {
					//call constructor if necessary
					console.log(_.upperFirst(mod));
					if (window[_.upperFirst(mod)]) {
						window[_.upperFirst(mod)]();
					}
				})
			}		
		}else{
			V.disableModule(name);
		}
	}
}

Veload.prototype.saveLayout = function () {
	var data = [];
	var e = $('.grid').data('grid');
	e = e.serialize();
	_.forEach(e, function (el, index) {
		e[index]["name"] = $(`.grid-item:nth-of-type(${index + 1})`).data('name');
	});
	data.push(e)
	$.post(self.opts.urls.remote.userLayout, { layout: data }, function (data) {
		console.log('layout saved');
	});
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
		$('body').addClass('playing stoppable');
		$('body').removeClass('paused');
		self.timer.start();
		self.refresher = self.startUpdating();
		$(document).trigger("start.veload");
	}else{
		V.pickTrackGUI();
	}
}

Veload.prototype.pause = function () {
	var self = this;
	$('body').removeClass('playing');
	$('body').addClass('paused');
	self.timer.pause();
	clearInterval(self.refresher);
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
	$.post(self.opts.urls.remote.publish, { points: self.points }, function (data) {
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
			error("Error uploading to Strava");
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


Veload.prototype.poll = function () {
	var self = this;
	$.getJSON(self.opts.urls.local.stats, function (data) {
		self.status = data;
		$(document).trigger('connectionInfo.veload', data);
	})
	.fail(function(){
		self.status = {};
		$(document).trigger('connectionInfo.veload');
	});
}

Veload.prototype.startUpdating = function () {
	self = this;
	var hrCount = 0;
	return setInterval(function () {
		if (self.currentConnection) {
			$.getJSON(self.opts.urls.local.stats, function (data) {
				//expect meters/second
				var metSpeed = new Number(data.speed);

				// m/s -> mph
				var speed = metSpeed * 2.23694;

				// speed point * (time since last update -> seconds)
				var last = _.last(self.points)
				var distance = metSpeed * (moment().diff(moment(last.time)) / 1000);
				console.log("traveled " + distance);
				if (distance && self.rTrail.length) {
					while (distance > self.rTrail[0].distance) {
						console.log("Change up!");
						//change direction
						//first, just bump us to the next waypoint
						self.points.push(new Point(self.rTrail[1].latlng.lat, self.rTrail[1].latlng.lng));
						//then, set the distance remaining after we get to the new waypoint
						distance = distance - self.rTrail[0].distance;
						//then, ditch the old waypoint
						self.rTrail.shift();
					}

					self.rTrail[0].distance = self.rTrail[0].distance - distance;
					console.log(self.rTrail[0].distance + " remaining until waypoint");
					var newLoc = geolib.computeDestinationPoint(last, distance, self.rTrail[0].bearing);
					var last5Cad = 0;
					var last5Speed = 0;
					var last5Hr = 0;
					var right = _.takeRight(self.points, 5)
					_.forEach(right, function (point) {
						last5Cad += point.cad;
						last5Speed += point.speed;
						last5Hr += point.hr;
					});
					var cad = (last5Cad + data.cadence) / (right.length + 1);
					var sp = (last5Speed + speed) / (right.length + 1);
					var hr = (last5Hr + data.hr) / (right.length + 1);
					var point = new Point(newLoc.latitude, newLoc.longitude, moment().format(), hr, cad, sp);
					console.log(point);
					self.points.push(point);
				} else {
					if (self.points.length) {
						self.points.push(new Point(_.last(self.points).lat, _.last(self.points).lng, moment().format(), _.last(self.points).hr, 0, 0));
					}
				}
				$(document).trigger('locationUpdated.veload');
				if (hrCount % 15 == 0) {
					$(document).trigger('hrUpdated.veload');
				}
				hrCount++;
			})
		}
	}, self.opts.UPDATEFREQ);
}

Veload.prototype.fullscreen = function (config) {
	if (config.caller != "voice") {
		$('body')[0].requestFullscreen();
	}
}

Veload.prototype.unpop = function () {
	$('body').removeClass('loading');
	$('#modal').modal('hide');
}
Veload.prototype.pop = function (cnf = {}, evt = {}) {
	var self = this;
	const config = Object.assign({
		title: 'Alert',
		body: '',
		accept: true,
		close: true,
		acceptText: 'Okay',
		acceptClass: 'btn-primary',
		modalClass: '',
		backdrop: 'static'
	}, cnf);
	const events = Object.assign({
		cancelClick: function () { },
		acceptClick: function () { }
	}, evt);
	console.log("loading modal");
	$('#modal-container').html(self.cTemps.modal(config));
	$('#modal .btn-cancel').on('click', events.cancelClick);
	$('#modal .btn-accept').on('click', events.acceptClick);
	$('#modal').modal('show');
}
Veload.prototype.getAvg = function (unit) {
	var self = this;
	return self.getDistance(unit) / (self.elapsed / 60 / 60);
}
Veload.prototype.getDistance = function (unit) {
	var self = this;
	var dm = geolib.getPathLength(self.points);
	if (unit == "miles") {
		return dm / 1609.344;
	} else if (unit == "meters") {
		return dm;
	}
}
Veload.prototype.loading = function () {
	$('body').addClass('loading');
}
Veload.prototype.charts = function () {
	var self = this;
	console.log('building charts');
	var charts = $('[data-chart]');
	charts.each(function (_ind, el) {
		
		var v = $(el);
		var opts = _.cloneDeep(self.opts.chart);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		console.log(`Building ${name}`);
		opts.type = v.data('chart');
		var chart = new Chart(v, opts);
		v.closest(".grid-item").data('chart', chart);

		$(document).on(`${v.data('listen')}.veload`, function () {
			if (self.points.length) {
				var point = _.last(self.points);
				console.log(`updating ${name} with x: ${moment(point.time).valueOf()} and y: ${point[param]} `);
				chart.data.datasets[0].data.push({ x: moment(point.time).valueOf(), y: point[param] });
				chart.data.datasets[0].pointBackgroundColor.push(self.GOOD);
				chart.data.datasets[0].backgroundColor = self.GOODBG;
				chart.update({ preservation: true });
			}
		});	
		$(document).on('start.veload',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = false;
			})
		});

		$(document).on('pause.veload',function(){
			_.forEach(chart.config.options.scales.xAxes,function(c,index){
				chart.config.options.scales.xAxes[index].realtime.pause = true;
			});
		});		
		console.log(`initialized.${name}`)
		$(document).trigger(`initialized.${name}`);					
	});
	$(document).on('clear.veload', function () {
		var charts = $('[data-chart]');
		charts.each(function (ind, el) {
			var v = $(el);
			v.closest('.grid-item').data('chart');
			v.data.datasets[0].data = [];
			v.update();
		})
	});
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