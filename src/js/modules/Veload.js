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
import '../../../node_modules/leaflet-providers/leaflet-providers.js';
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

["user","status","athlete", "refresher", "desiredSpeed", "elapsed", "$grid", "myIcon", "photos"].forEach(function (e) {
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
		var mob = {}
		var def = {
			size_x: 1,
			size_y: 1,
			col: 1,
			row: 1
		}
		if($(window).width()<1000){
			var mob = Object.cloneDeep(def);
		}
		const config = Object.assign(def, cnf, mob);
		var name = mod + "-module";
		var el = document.getElementById(name);
		if(el){
			var src = el.innerHTML;
			var comp = Handlebars.compile(src)();

			var finishedEvent = `initialized.${mod}`;

			console.log("waiting for " + finishedEvent);
			self.listenForFinish(finishedEvent);
			$('.grid').data('grid').add_widget(comp, config.size_x, config.size_y, config.col, config.row);
		
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

Veload.prototype.unpop = function () {
	$('body').removeClass('loading');
	$('#modal').modal('hide');
	$('.modal-backdrop').not('.loader').remove();
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
		cancelClick: function (e) {
			V.unpop();
		 },
		acceptClick: function () { }
	}, evt);
	console.log("loading modal");
	$('#modal-container').html(self.cTemps.modal(config));
	$('#modal .btn-cancel').on('click', events.cancelClick);
	$('#modal .btn-accept').on('click', events.acceptClick);
	$('#modal').modal('show');
}

$('#modal-container').on('hidden.bs.modal','#modal',function(){
	console.log("destroying modal");
	$('#modal').modal('dispose').removeClass().addClass('modal fade');
	$('body').removeClass('modal-open');
});	
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
	} else if (unit == "kilometers"){
		return dm / 1000;
	}
}
Veload.prototype.loading = function () {
	$('body').addClass('loading');
}

Veload.prototype.setColors = function(){
	var self = this;
	$('.card-body,.navbar').css('background-color',self.opts.colors.MAINBG).css('color',self.opts.colors.MAINTXT);
	$('.btn-outline-secondary').css({'color':self.opts.colors.DARK,'border-color':self.opts.colors.DARK});	
	$('.btn-outline-primary').css({'color':self.opts.colors.DARKER,'border-color':self.opts.colors.DARKER});
	$('.btn-primary,.btn-toggle.active').css({'background-color':self.opts.colors.DARKER,'border-color':self.opts.colors.DARKER});
	$('.btn-outline-primary,.btn-outline-secondary').hover(function(){
		$(this).css({'background-color':'rgba(0,0,0,.05)'});
	},function(){
		$(this).css({'background-color':''});
	})

	Chart.defaults.global.defaultColor = this.opts.colors.MAINTXT;		
	var chart = $('.grid-item:has([data-chart])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart')
		c.update();
	})
}
Veload.prototype.charts = function () {
	var self = this;
	console.log('building charts');
	var charts = $('[data-chart]');
	charts.each(function (_ind, el) {
		console.log('initializing' + el);
		var v = $(el);
		var opts = _.cloneDeep(self.opts.chart);
		var name = v.closest('[data-name]').data('name');
		var param = v.data('param');
		console.log(`Building ${name}`);
		opts.type = v.data('chart');
		var chart = new Chart(v, opts);

		//hacky workaround to render chart properly
		chart.config.options.scales.xAxes[0].realtime.pause = false;
		chart.update();
		chart.config.options.scales.xAxes[0].realtime.pause = true;
		chart.update()

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
		var chart = $('.grid-item:has([data-chart])');
		chart.each(function(_i,ch){
			var v = $(ch).data('chart')		
			v.data.datasets[0].data = [];
			v.data.datasets[0].pointBackgroundColor = [];
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