'use strict';
import _ from 'lodash';
import 'bootstrap';
import moment from 'moment';

import setColors from './ColorControls.js';
import Options from './Options.js';
import Modals from './Modals.js';
import Templates from './Templates.js';
import { Charts } from './Charts.js';
import { EE } from './EventBus.js';
import { grid } from './Grid.js';
import { map } from './Map.js';
import './Utils.Trail.js';

function Veload(){
	var self = this;
	this.status = {};
	['rTrail','points','rTrailPopped'].forEach(function(e){
		self[e] = [];
	});

	['user','status','athlete','refresher','photos'].forEach(function(e){
		self[e] = '';
	});
	window.V = this;
	window.Veload = window.V;
	EE.emit('Veload.initialized');
	if (!(this instanceof Veload)){
		return new Veload();
	}
}

Veload.prototype.start = function(){
	var self = this;
	if (self.points.length){
		var config = {
			title: 'waiting for sensors to connect',
			overClass: 'bigButtons',
			content: Templates.get('buttons')()
		};
		var over = $(Templates.get('overlay')(config));
		var b = $('body').append(over);

		var connected = setInterval(function(){ self.sensorsConnected(self); },100);
		EE.on('Veload.sensorsConnected',function(){
			clearInterval(connected);
			over.remove();
			b.addClass('playing stoppable').removeClass('paused');

			EE.emit('Veload.start');
		});
	} else {
		$('body').append(Templates.get('start')());
		V.map = map;
		map.pickTrackGUI();
		EE.once('Map.trackLoading',function(){
			Modals.unpop();
			Modals.pop({
				title: 'Select or Create a Workout?',
				body: $('.GoalSelectOrBuild').html(),
				accept: false
			});
		});
		EE.once('Veload.workoutLoaded Veload.workoutSaved',function(){
			Modals.unpop();
			self.start();
		});
	}
};
Veload.prototype.sensorsConnected = function(self){
	var desired = [self.user.hr,self.user.cadence,self.user.speed];
	var connected = [self.status.sensors.hr,self.status.sensors.cadence,self.status.sensors.speed];
	if (_.isEqual(desired,connected)){
		EE.emit('Veload.sensorsConnected');
	}
};
Veload.prototype.pause = function(){
	$('body').removeClass('playing');
	$('body').addClass('paused');
	EE.emit('Veload.pause');
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
		Modals.pop(config,events);
	}
	EE.emit('Veload.stop');
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
			Modals.unpop();
			EE.emit('Veload.clear');
		}
	};
	Modals.pop(config,events);
};

Veload.prototype.upload = async function(){
	var self = this;
	$('.modal-footer').loader(36,36,true);
	self.rTrailPopped.forEach(function(val,i){
		self.rTrailPopped[i].time = moment(val.time).format();
	});
	$.post(Options.urls.remote.publish,{ points: self.rTrailPopped },function(data){
		if (data.id){
			var config = {
				title: 'Congrats!',
				body: 'Congratulations, your ride has been uploaded!',
				accept: false,
				close: true,
				cancelText: 'Finish'
			};
			$('#modal').on('hidden.bs.modal',function(){
				Modals.pop(config);
			});
			Modals.unpop();
		} else {
			Modals.error('Error uploading to Strava');
		}
	}).fail(function(err){
		Modals.error(`<p>Error uploading. <strong>Please contact support.</strong></p><p class="text-danger font-weight-light">Diagnostic Info: Server (${self.remote.publish}) responded (${err.status} ${err.statusText})</p>`);
	});
};

Veload.prototype.fullscreen = function(config){
	if (config.caller != 'voice'){
		$('body')[0].requestFullscreen();
	}
};

Veload.prototype.loading = function(){
	$('body').addClass('loading');
};

//first thing loaded
Veload.prototype.loadInterface = async function(){
	var self = this;
	if (window.location.pathname == '/dashboard'){
		self.loadDash();

		//wait until modules loaded before showing loaded
		EE.once('Grid.modulesLoaded',function(){
			$('body').removeClass('loading');
		});

		EE.on('Veload.loaded',function(){
			$('[data-ride="carousel"]').carousel();
			setColors();
		});
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
			$.getJSON(Options.urls.remote.modules,function(modules){
				_.forEach(modules,function(mod){
					grid.enableModule(mod);
				});

				//html is ready to play
				self.loaded();
			});
		}
	});
	EE.emit('Veload.modulesQueued');
};
Veload.prototype.loaded = function(){
	EE.emit('Veload.loaded');
};

//second thing loaded
Veload.prototype.loadProfile = function(){
	var self = this;
	$.getJSON(Options.urls.remote.athlete,function(data){
		$('body').removeClass('loggedout').addClass('loggedin');
		self.athlete = data;
		$('#profile button').html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + self.athlete.profile + '" />');
	});
};
Veload.prototype.getUser = function(callback){
	var self = this;
	$.getJSON(Options.urls.remote.userAll,function(data){
		var changed = self.status.circumference == data.circumference;
		self.user = data;
		Options.updateLocal(data.url);
		EE.emit('Veload.remoteInfo');
		if (changed){
			$.post(`${Options.urls.local.circ}?value=${data.circumference}`,function(){
			}).fail(function(){
				Modals.error(`Error updating the Veload Monitor's circumference setting. Please restart the Veload Monitor.`);
			});
		}
		EE.emit('Veload.userUpdated');
		if (callback){
			callback(data);
		}
	});
};
//third thing loaded
Veload.prototype.loadDash = async function(){
	await import('./Voice.js');
	grid.initGrid();
	$('[data-tooltip="tooltip"],[data-toggle="tooltip"]').tooltip();
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

let V = new Veload();

export default V;
