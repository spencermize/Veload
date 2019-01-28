'use strict';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import Handlebars from 'handlebars';

import moment from 'moment';
window.moment = moment;

import Chart from 'chart.js';

import 'chartjs-plugin-streaming';

import 'bootstrap';

import '../third_party/gridster/jquery.gridster.min.js';

import Point from './Point.js';
window.Point = Point;

//Expose common libraries for modules
import _ from 'lodash';

import Leaflet from 'leaflet';
window.Leaflet = Leaflet;

import numeral from 'numeral';
window.numeral = numeral;

import List from 'list.js';
window.List = List;

import omni from '@mapbox/leaflet-omnivore';
window.omni = omni;

import ico from '@ansur/leaflet-pulse-icon';
window.ico = ico;

import geolib from 'geolib';
window.geolib = geolib;

var l = ["status", "stats", "circ"];
var local = [];
const localUrl = "http://localhost:3001";
_.forEach(l, function (n) {
	var k = n.replace("_", "/");
	var m = _.camelCase(n);
	local[m] = `${localUrl}/${k}`;
});

var r = ["publish", "athlete", "athlete_routes", "athlete_activities", "user_layout", "user_modules"];
var remote = [];
const remoteUrl = "/api";

_.forEach(r, function (n) {
	var k = n.replace("_", "/");
	var l = _.camelCase(n);
	remote[l] = `${remoteUrl}/${k}`;
});

//set some defaults
Veload.prototype.UPDATEFREQ = 1000;
Veload.prototype.MPHFORM = '0,000.00';
Veload.prototype.GOOD = "#28a745";
Veload.prototype.GOODBG = "#53F377";
Veload.prototype.BAD = "#dc3545";
Veload.prototype.BADBG = "#E27A84";
Veload.prototype.chartOps = {
	type: 'line',
	data: {
		datasets: [{
			data: [],
			pointRadius: 3,
			pointBackgroundColor: []
		}]
	},
	options: {
		tooltips: {
			enabled: false
		},
		scales: {
			xAxes: [{
				type: 'realtime',   // x axis will auto-scroll from right to left
                realtime: {         // per-axis options
                    duration: 20000,    // data in the past 20000 ms will be displayed
                    delay: 1000,        // delay of 1000 ms, so upcoming values are known before plotting a line
                    pause: false,       // chart is not paused
                    ttl: undefined      // data will be automatically deleted as it disappears off the chart
                }
			}],
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		},
        plugins: {
            streaming: {            // per-chart option
                frameRate: 30       // chart is drawn 30 times every second
            }
        },
		legend: {
			display: false
		},
		responsive: true,
		maintainAspectRatio: false
	}
};
Veload.prototype.remote = remote;
Veload.prototype.local = local;

["rTrail", "cTemps", "enabledMods", "modLoadQueue", "points"].forEach(function (e) {
	Veload.prototype[e] = [];
});

["currentConnection", "athlete", "refresher", "desiredSpeed", "elapsed", "$grid", "myIcon", "photos"].forEach(function (e) {
	Veload.prototype[e] = "";
});


function Veload(opts) {
	if (!(this instanceof Veload)) return new Veload(opts);
}
Veload.prototype.settings = function () {
	var src = $('#settings-temp').html();
	self.loading();
	$.getJSON(remote.userModules, function (data) {
		var opts = {
			enabledMods: _.map(self.enabledMods, function (e) { return [e, _.startCase(e)] }),
			allMods: _.map(data, function (e) { return [e, _.startCase(e)] }),
			links: ["visibility", "connection"]
		}
		//console.log(opts);
		var comp = Handlebars.compile(src);
		comp = comp(opts);
		var popts = {
			title: "Veload Settings",
			body: comp,
			accept: false
		}
		self.unpop();
		self.pop(popts);
		_.forEach(_.difference(data, self.enabledMods), function (el) {
			$(`[data-name=${el}] .btn-toggle`).removeClass('active');
		});
	})
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
	el.fadeOut(400, function () {
		_.pull(self.enabledMods, mod);
		$('.grid').data('grid').remove_widget(el);
		self.saveLayout();
	})
}

Veload.prototype.enableModule = function (mod, cnf) {
	console.log(`enabling ${mod}`);
	self.enabledMods.push(mod);
	const config = Object.assign({
		size_x: 1,
		size_y: 1,
		col: 1,
		row: 1
	}, cnf);
	var name = mod + "-module";
	var el = document.getElementById(name);
	var src = el.innerHTML;
	var comp = Handlebars.compile(src)();
	var finishedEvent = `initialized.${mod}`;

	console.log("waiting for " + finishedEvent);
	self.listenForFinish(finishedEvent);
	$('.grid').data('grid').add_widget(src, config.size_x, config.size_y, config.col, config.row);

	if($(`[data-name=${mod}]`).data("script")){
		$.getScript(`/js/_${mod}.js`, function () {
			//call constructor if necessary
			if (self[mod]) {
				self[mod]();
			}
		})
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
	$.post(self.remote.userLayout, { layout: data }, function (data) {
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
	$('body').addClass('playing stoppable');
	$('body').removeClass('paused');
	self.timer.start();
	self.refresher = self.startUpdating();
	self.photos = self.photoRefresher();
	$(document).trigger("vStart");
}

Veload.prototype.pause = function () {
	var self = this;
	$('body').removeClass('playing');
	$('body').addClass('paused');
	self.timer.pause();
	clearInterval(self.refresher);
	clearInterval(self.photos);
	$(document).trigger("vPause");
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
	$(document).trigger("vStop");
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
Veload.prototype.photoRefresher = function () {
	var radius = .5;
	const maxResults = 50;
	return setInterval(function () {
		$.getJSON(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f01b5e40d794a63ebd9b51fd4eb985ab&lat=${_.last(self.points).lat}&lon=${_.last(self.points).lng}&format=json&extras=url_o,url_k,url_h&radius=${radius}&per_page=${maxResults}&tags=beautiful,pretty,sunset,sunrise,architecture,landscape,building,outdoors,trail,travel&sort=interestingness-desc&content_type=1&nojsoncallback=1,has_geo=true`, function (data) {
			var url = "";
			if (data.photos.total > 0) {
				var attempts = 0;
				if (data.photos.total < 20) {
					radius = radius * 2;
				}
				while (!url && attempts < (data.photos.photo.length)) {
					const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length - 1))];
					url = p.url_o ? p.url_o : p.url_k;
					console.log('attempting...' + url);
					attempts++;
				}
				if (!url) {
					radius = radius * 2;
					url = data.photos.photo[0].url_h;
				}
				if (url && `url("${url}")` != $('.bg.blurrer').css('background-image')) {
					$('<img/>').attr('src', url).on('load', function () {
						$(this).remove();
						var el1 = $('.bg.blurrer').addClass("curr");
						el1.before("<span class='bg blurrer' />");
						var el2 = $('.bg.blurrer:not(.curr)');
						el2.css({ 'background-image': `url(${url})` });
						el2.addClass('in');
						$('.bg.blurrer.curr').removeClass('in');
						setTimeout(function () { $('.bg.blurrer.curr').remove(); }, 2000);
					});
				}
			} else {
				radius = radius * 2;
			}
		});
	}, 15000);
}
Veload.prototype.upload = function () {
	var self = this;
	$('.modal-footer').loader(36, 36, true);
	$.post(self.remote.publish, { points: self.points }, function (data) {
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
	$.getJSON(self.local.status, function (data) {
		if (data.status && data.status.length) {
			self.connected(data);
		} else {
			self.notConnected();
		}
	});
}

Veload.prototype.startUpdating = function () {
	self = this;
	var hrCount = 0;
	return setInterval(function () {
		if (self.currentConnection) {
			$.getJSON(self.local.stats, function (data) {
				//expect meters/second
				var metSpeed = new Number(data.speed);

				// m/s -> mph
				var speed = metSpeed * 2.23694;

				// speed point * (time since last update -> seconds)
				var distance = metSpeed * (moment().diff(moment()) / 1000);
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
					var newLoc = geolib.computeDestinationPoint(_.last(self.points), distance, self.rTrail[0].bearing);
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
	}, self.UPDATEFREQ);
}

Veload.prototype.fullscreen = function (config) {
	if (config.caller != "voice") {
		$('body')[0].requestFullscreen();
	}
}

Veload.prototype.notConnected = function () {
	if (!$('.disco').length) {
		var self = this;
		var config = {
			title: 'Error!',
			body: 'Please check that your sensor is connected in the veload monitor!',
			accept: true,
			close: false,
			acceptText: 'Retry',
			modalClass: 'disco'
		}
		const events = {
			acceptClick: function () {
				self.poll()
			}
		}
		this.pop(config, events);
	}
},
	Veload.prototype.connected = function (data) {
		self.currentConnection = data.status;
		const config = {
			status: `veload connected on port ${data.status}`,
			statusClass: ''
		}
		if ($('#modal').hasClass('disco')) {
			self.unpop();
		}
	},
	Veload.prototype.unpop = function () {
		$('#modal').modal('hide');
		$('body').removeClass('loading');
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
		var opts = _.cloneDeep(self.chartOps);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		console.log(`Building ${name}`);
		opts.type = v.data('chart');
		var chart = new Chart(v, opts);
		v.closest(".grid-item").data('chart', chart);

		$(document).on(`${v.data('listen')}.veload`, function () {
			if (self.points.length) {
				var point = _.last(self.points);
				var chart = v.closest(".grid-item").data('chart');
				console.log(`updating ${name} with x: ${moment(point.time).valueOf()} and y: ${point[param]} `);
				chart.data.datasets[0].data.push({ x: moment(point.time).valueOf(), y: point[param] });
				chart.data.datasets[0].pointBackgroundColor.push(self.GOOD);
				chart.data.datasets[0].backgroundColor = self.GOODBG;
				chart.update({ preservation: true });
			}
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

Handlebars.registerHelper({
	eq: function (v1, v2) {
		return v1 === v2;
	},
	ne: function (v1, v2) {
		return v1 !== v2;
	},
	lt: function (v1, v2) {
		return v1 < v2;
	},
	gt: function (v1, v2) {
		return v1 > v2;
	},
	lte: function (v1, v2) {
		return v1 <= v2;
	},
	gte: function (v1, v2) {
		return v1 >= v2;
	},
	and: function () {
		return Array.prototype.slice.call(arguments).every(Boolean);
	},
	or: function () {
		return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
	},
	debug: function (optionalValue) {
		console.log("Current Context");
		console.log("====================");
		console.log(this);

		if (optionalValue) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}
	},
	ifIn: function (elem, list, options) {
		if (list) {
			console.log(list);
			console.log(elem);
			if (list.indexOf(elem) > -1) {
				return options.fn(this);
			}
			return options.inverse(this);
		} else {
			return false;
		}
	}
});

export {Veload};