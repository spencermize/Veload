'use strict';
import _ from 'lodash';
import 'bootstrap';
import * as annyang from 'annyang';

import { setColors } from './ColorControls.js';
import { Options } from './Options.js';
import { PhotoRefresher } from './PhotoRefresher.js';
import { Charts } from './Charts.js';
import { grid } from './Grid.js';
import { map } from './Map.js';
import './Utils.Trail.js';

window.$ = $;

function Veload(opts){
	var self = this;
	this.opts = opts;
	this.status = {};
	['rTrail','cTemps','points','rTrailPopped'].forEach(function(e){
		self[e] = [];
	});

	['user','status','athlete','refresher','photos'].forEach(function(e){
		self[e] = '';
	});
	window.V = this;
	window.Veload = window.V;
	$(document).trigger('initialized.veload');
	if (!(this instanceof Veload)){
		return new Veload(opts);
	}
}

Veload.prototype.start = function(){
	var self = this;
	if (self.points.length){
		var config = {
			title: 'waiting for sensors to connect',
			overClass: 'bigButtons',
			content: self.cTemps['buttons']()
		};
		var over = $(self.cTemps['overlay'](config));
		var b = $('body').append(over);

		var connected = setInterval(function(){ self.sensorsConnected(self); },500);
		$(document).on('sensorsConnected.veload',function(){
			clearInterval(connected);
			over.remove();
			b.addClass('playing stoppable').removeClass('paused');

			$(document).trigger('start.veload');
		});
	} else {
		$('body').append(V.cTemps['start']());
		V.map = map;
		map.pickTrackGUI();
		$(document).one('trackLoading.veload',function(){
			V.unpop();
			V.pop({
				title: 'Select or Create a Workout?',
				body: $('.GoalSelectOrBuild').html(),
				accept: false
			});
		});
		$(document).one('workoutLoaded.veload workoutSaved.veload',function(){
			V.unpop();
			V.start();
		});
	}
};
Veload.prototype.sensorsConnected = function(self){
	var desired = [self.user.hr,self.user.cadence,self.user.speed];
	var connected = [self.status.sensors.hr,self.status.sensors.cadence,self.status.sensors.speed];
	if (_.isEqual(desired,connected)){
		$(document).trigger('sensorsConnected.veload');
	}
};
Veload.prototype.pause = function(){
	$('body').removeClass('playing');
	$('body').addClass('paused');
	$(document).trigger('pause.veload');
};
Veload.prototype.stop = function(){
	var self = this;
	self.pause();
	if (self.points.length){
		var config = {
			title: 'End ride?',
			body: 'Are you sure you want to end this ride and upload to Strava?',
			accept: true,
			close: true,
			acceptText: 'Finish',
			cancelText: 'Go back'
		};
		const events = {
			acceptClick: function(){
				self.upload();
			}
		};
		self.pop(config,events);
	}
	$(document).trigger('stop.veload');
};
Veload.prototype.clear = function(){
	var self = this;
	self.pause();
	var config = {
		title: 'Clear this ride?',
		body: 'Are you sure you want to clear your ride? You will lose all data in this window.',
		accept: true,
		close: true,
		acceptText: 'Clear',
		acceptClass: 'btn-danger',
		cancelText: 'Go back'
	};
	const events = {
		acceptClick: function(){
			self.points = [];
			self.rTrailPopped = [];
			$('body').removeClass('stoppable');
			self.unpop();
			$(document).trigger('clear.veload');
		}
	};
	self.pop(config,events);
};

Veload.prototype.upload = async function(){
	var moment = await import('moment');
	var self = this;
	$('.modal-footer').loader(36,36,true);
	self.rTrailPopped.forEach(function(val,i){
		self.rTrailPopped[i].time = moment(val.time).format();
	});
	$.post(self.opts.urls.remote.publish,{ points: self.rTrailPopped },function(data){
		if (data.id){
			var config = {
				title: 'Congrats!',
				body: 'Congratulations, your ride has been uploaded!',
				accept: false,
				close: true,
				cancelText: 'Finish'
			};
			$('#modal').on('hidden.bs.modal',function(){
				self.pop(config);
			});
			self.unpop();
		} else {
			self.error('Error uploading to Strava');
		}
	}).fail(function(err){
		self.error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${self.remote.publish}) responded (${err.status} ${err.statusText})</p>`);
	});
};
Veload.prototype.error = function(err){
	var config = {
		title: 'Error',
		body: `${err}`,
		accept: false,
		close: true
	};
	this.unpop();
	this.pop(config);
};

Veload.prototype.fullscreen = function(config){
	if (config.caller != 'voice'){
		$('body')[0].requestFullscreen();
	}
};

Veload.prototype.loading = function(){
	$('body').addClass('loading');
};

Veload.prototype.unpop = function(){
	$('body').removeClass('loading');
	$('#modal').modal('hide');
	$('.modal-backdrop').not('.loader').remove();
};

Veload.prototype.pop = function(cnf = {},evt = {}){
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
	},cnf);
	const events = Object.assign({
		cancelClick: function(){
			V.unpop();
		},
		acceptClick: function(){ }
	},evt);
	$('#modal-container').html(self.cTemps.modal(config));
	$('#modal .btn-cancel').on('click',events.cancelClick);
	$('#modal .btn-accept').on('click',events.acceptClick);
	if (config.width){
		$('.modal-dialog').css('max-width',config.width);
	}
	$('#modal').modal('show');
	$('[data-tooltip=tooltip]').tooltip();
	setColors();
};

$('#modal-container').on('hidden.bs.modal','#modal',function(){
	$('#modal').modal('dispose').removeClass().addClass('modal fade');
	$('body').removeClass('modal-open');
});

//first thing loaded
Veload.prototype.loadInterface = function(){
	var self = this;
	//load required elements
	var templates = $('[id$="-temp"]');
	templates.each(function(_i,e){
		var el = $(e);
		self.cTemps[el.attr('id').split('-')[0]] = Handlebars.compile(el.html());
	});

	if (window.location.pathname == '/dashboard'){
		self.loadDash();

		//wait until modules loaded before showing loaded
		$(document).one('modulesLoaded.grid',function(){
			$('body').removeClass('loading');
		});

		$(document).on('loaded.veload',function(){
			//build up the charts

			//I really want to use this sytax but I'm doing something wrong...
			//import("./Charts.js").then(Charts=>{Charts()})
			Charts();
			$('[data-ride="carousel"]').carousel();
			setColors();
		});
	} else {
		$('body').removeClass('loading');
	}

	//enable each module
	self.getUser(function(data){
		if (data.layout){
			_.forEach(data.layout[0],function(obj){
				grid.enableModule(obj.name,obj);
			});

			//html is ready to play
			self.loaded();
		} else {
			$.getJSON(self.opts.urls.remote.modules,function(modules){
				_.forEach(modules,function(mod){
					grid.enableModule(mod);
				});

				//html is ready to play
				self.loaded();
			});
		}
	});
	$(document).trigger('modulesQueued.veload');
};
Veload.prototype.loaded = function(){
	$(document).trigger('loaded.veload');
};

//second thing loaded
Veload.prototype.loadProfile = function(){
	var self = this;
	$.getJSON(self.opts.urls.remote.athlete,function(data){
		$('body').removeClass('loggedout').addClass('loggedin');
		self.athlete = data;
		$('#profile button').html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + self.athlete.profile + '" />');
	});
};
Veload.prototype.getUser = function(callback){
	var self = this;
	$.getJSON(self.opts.urls.remote.userAll,function(data){
		var changed = self.status.circumference == data.circumference;
		self.user = data;
		self.opts.updateLocal(data.url);
		$(document).trigger('remoteInfo.veload');
		if (changed){
			$.post(`${self.opts.urls.local.circ}?value=${data.circumference}`,function(){
			}).fail(function(){
				self.error(`Error updating the Veload Monitor's circumference setting. Please restart the Veload Monitor. ${self.opts.resetConnection}`);
			});
		}
		$(document).trigger('userUpdated.veload');
		if (callback){
			callback(data);
		}
	});
};
//third thing loaded
Veload.prototype.loadDash = function(){
	this.initVoice();
	this.poller.poll();
	this.poller.startPolling(3000);
	PhotoRefresher();
	grid.initGrid();
	$('[data-tooltip="tooltip"],[data-toggle="tooltip"]').tooltip();
};

Veload.prototype.initVoice = function(){
	var self = this;
	if (annyang){
	//add all commands from buttons that have [data-cmd] (not all functions will be valid)
		var commands = {};
		$('button[data-cmd]').each(function(ind,el){
			var cmd = $(el).data('cmd');
			commands[cmd] = function(){ self[cmd]({ caller: 'voice' }); };

			var alt = $(el).data('voice-alt');
			if (alt){
				alt = alt.split(',');
				alt.forEach(function(el){
					commands[el] = function(){ self[cmd]({ caller: 'voice' }); };
				});
			}
		});

		annyang.addCommands(commands);

		annyang.addCommands({
			'select item :num': {
				callback: function(num){
					$(`#modal li:eq(${num - 1}) [data-cmd]`).click();
				},
				regexp: /^select item ([0-9])$/
			}
		});

		annyang.addCallback('resultMatch',function(userSaid){
			var config = {
				message: userSaid,
				title: 'command recognized',
				class: 'speech',
				mainClass: 'top'
			};
			var over = $(self.cTemps['overlay'](config));
			$('body').append(over);
			setTimeout(function(){
				over.remove();
			},2000);
		});
		annyang.addCallback('error',function(err){
			if (err.error != 'no-speech'){
				V.error('The speech engine has crashed - do you have another Veload tab open?');
			}
		});

		annyang.start({ autoRestart: true });
	}
};

//===============HELPERS===================
$.fn.loader = function(height = 64,width = 64,clear = false){
	if (clear){
		$(this).empty();
	}
	$(this).append(loadAni(height,width));
	return this;
};
function loadAni(height = 64,width = 64){
	return `<span style='height:${height}px;width:${width}px' class='spin'/>`;
}
$.fn.cleanWhitespace = function(){
	this.contents().filter(
		function(){ return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
		.remove();
	return this;
};
let V = new Veload(Options);

export { V };
