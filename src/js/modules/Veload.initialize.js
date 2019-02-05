import {PhotoRefresher} from './PhotoRefresher.js';
import {setColors} from './ColorControls.js';
import './Grid.js';
import _ from 'lodash';
import { Charts } from './Charts.js';
const annyang = require("annyang");

// first thing loaded
Veload.prototype.loadInterface = function(){
	var self = this;
	// load required elements
	console.log('loading interface...');
	var templates = $('[id$="-temp"]');
	templates.each(function(_i,el){
		var el = $(el);
		self.cTemps[el.attr("id").split("-")[0]] = Handlebars.compile(el.html());	
	})
	
	if(window.location.pathname=="/dashboard"){
		console.log('loading dash...');
		//ensure timers are ready to go so we can attach listeners;
		self.initTimers();
		self.loadDash();
	
		//wait until modules loaded before showing loaded
		$(document).one('modulesLoaded.veload',function(){
			$("body").removeClass("loading");				
		});	
		
		$(document).one('loaded.veload',function(){
			//build up the charts
			
			//I really want to use this sytax but I'm doing something wrong...
			//import("./Charts.js").then(Charts=>{Charts()})

			require('./Charts.js');
			Charts();
			$('[data-ride="carousel"]').carousel();	
			setColors();
		})		
	}else{
		$("body").removeClass("loading");			
	}


	$(document).trigger('modulesLoading.veload');
	
	//enable each module
	self.getUser(function(data){
		console.log('loading modules');
		if(data.layout){
			var modules = _.keyBy(data.layout[0], 'name');
			_.forEach(modules,function(obj,mod){
				self.enableModule(mod,obj);
			});
		
			//html is ready to play
			self.loaded();
		}else{
			$.getJSON(self.opts.urls.remote.modules,function(modules){
				_.forEach(modules,function(mod){
					console.log(mod)
					self.enableModule(mod);
				});

				//html is ready to play
				self.loaded();
			})
		}
	})
}
Veload.prototype.loaded = function(){
	console.log('loaded.veload');
	$(document).trigger('loaded.veload');
}

//second thing loaded
Veload.prototype.loadProfile = function(){
	var self = this;
	$.getJSON(self.opts.urls.remote.athlete,function(data){
		$("body").removeClass("loggedout").addClass("loggedin");
		self.athlete = data;
		$("#profile button").html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + self.athlete.profile +'" />');
	});	
}
Veload.prototype.getUser = function(callback){
	console.log('getting user data')
	var self = this;
	$.getJSON(self.opts.urls.remote.userAll,function(data){
		var changed = self.status.circumference == data.circumference;
		self.user = data;
		self.opts.updateLocal(data.url);
		$(document).trigger('remoteInfo.veload');
		if(changed){
			$.post(`${self.opts.urls.local.circ}?value=${data.circumference}`,function(){
			}).fail(function(){
				self.error(`Error updating the Veload Monitor's circumference setting. Please restart the Veload Monitor. ${self.opts.resetConnection}`);
			})
		}
		$(document).trigger('userUpdated.veload');
		if(callback){
			callback(data);
		}
	})
}
//third thing loaded
Veload.prototype.loadDash = function(){
	var self = this;
	self.initVoice();
	V.poller.poll();
	V.poller.startPolling(3000);
	PhotoRefresher();
	self.initGrid();
	$('[data-toggle="tooltip"]').tooltip();
}

Veload.prototype.initTimers = function(){
	var self = this;
	self.timer = new Timer();
	self.timer.addEventListener('secondsUpdated', function (e) {
		self.elapsed = self.timer.getTotalTimeValues().seconds;
	});
}


Veload.prototype.initVoice = function(){
	self = this;
	if (annyang) {
	// add all commands from buttons that have [data-cmd] (not all functions will be valid)
		var commands = {}
		$('button[data-cmd]').each(function(ind,el){
			var cmd = $(el).data('cmd');
			commands[cmd] = function(){ self[cmd]({caller: "voice"}) }
			
			var alt = $(el).data('voice-alt');
			if(alt){
				alt = alt.split(',');
				alt.forEach(function(el){
					commands[el] = function(){ self[cmd]({caller: "voice"}) }
				});
			}
		});

		// Add our commands to annyang
		annyang.addCommands(commands);

		annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
			var config = {
				message: userSaid,
				title: "command recognized",
				class: "speech"
			}
			var over = $(self.cTemps['overlay'](config));
			$('body').append(over);
			setTimeout(function(){
				over.remove();
			},2000);
		});

		// Start listening.
		annyang.start({ autoRestart: true });
	}
}