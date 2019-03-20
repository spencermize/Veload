'use strict';
import _ from 'lodash';
import 'bootstrap';

import setColors from './ColorControls.js';
import Options from './Options.js';
import Modals from './Modals.js';

import { notLoading } from './Loading.js';
import { EE } from './EventBus.js';
import { grid } from './Grid.js';
import './Utils.Trail.js';

function Veload(){
	var self = this;
	this.status = {};
	this.user = {};
	this.status = {};
	['rTrail','points','rTrailPopped'].forEach(function(e){
		self[e] = [];
	});

	window.V = this;
	EE.emit('Veload.initialized');
	if (!(this instanceof Veload)){
		return new Veload();
	}
}

Veload.prototype.sensorsConnected = function(self){
	var desired = [self.user.hr,self.user.cadence,self.user.speed];
	var connected = [self.status.sensors.hr,self.status.sensors.cadence,self.status.sensors.speed];
	if (_.isEqual(desired,connected)){
		EE.emit('Veload.sensorsConnected');
	}
};

Veload.prototype.fullscreen = function(config){
	if (config.caller != 'voice'){
		$('body')[0].requestFullscreen();
	}
};

//first thing loaded
Veload.prototype.loadInterface = async function(){
	var self = this;
	//wait until modules loaded before showing loaded
	EE.once('Grid.modulesLoaded',function(){
		notLoading();
	});

	EE.on('Veload.loaded',function(){
		$('[data-ride="carousel"]').carousel();
		$('[data-tooltip="tooltip"],[data-toggle="tooltip"]').tooltip();
		setColors();
	});

	//enable each module
	self.getUser(function(data){
		if (data.layout){ //user has been here before
			_.forEach(data.layout[0],function(obj){
				grid.enableModule(obj.name,obj);
			});

			//html is ready to play
			EE.emit('Veload.loaded');
		} else { //initialize a dashboard
			$.getJSON(Options.urls.remote.modules,function(modules){
				_.forEach(modules,function(mod){
					grid.enableModule(mod);
				});

				//html is ready to play
				EE.emit('Veload.loaded');
			});
		}
	});
	EE.emit('Veload.modulesQueued');
};

//second thing loaded
Veload.prototype.loadProfile = function(){
	$.getJSON(Options.urls.remote.athlete,function(data){
		$('body').removeClass('loggedout').addClass('loggedin');
		$('#profile button').html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + data.profile + '" />');
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

let V = new Veload();

export default V;
