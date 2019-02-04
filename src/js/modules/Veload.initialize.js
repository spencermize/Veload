import {PhotoRefresher} from './PhotoRefresher.js';
import {setColors} from './ColorControls.js';
import _ from 'lodash';
const annyang = require("annyang");

// first thing loaded
Veload.prototype.loadInterface = function(){
	var self = this;
	// load required elements
	console.log('loading interface...');
	var elements = ['modal','footer','overlay'];
	elements.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		self.cTemps[templ] = Handlebars.compile(src);	
	});	
	
	//ensure timers are ready to go so we can attach listeners;
	self.initTimers();

	if(window.location.pathname=="/dashboard"){
		console.log('loading dash...');
		self.loadDash();
	}else{
		$("body").removeClass("loading");			
	}

	//wait until modules loaded before showing loaded
	$(document).one('modulesLoaded.veload',function(){
		$("body").removeClass("loading");				
	});	
	
	$(document).one('loaded.veload',function(){
		//build up the charts
		self.charts();	
		$('[data-ride="carousel"]').carousel();	
		setColors();
	})
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

Veload.prototype.initGrid = function(){
	var self = this;
	var gridSettings = {
		widget_selector: '.grid-item',
		widget_base_dimensions: self.getWidgetSize(),
		widget_margins: [self.opts.grid.margX,self.opts.grid.margY],
		draggable: {
			stop: function(){
				self.saveLayout()
			},
			handle: '.card-header'
		},
		shift_widgets_up: false,
		resize: {
			enabled: true,
			stop: function (e, ui, $widget) {
				self.saveLayout()
				$(document).trigger(`gridItemResized.${$(e.target).closest('.grid-item').data('name')}`);
			}
		},
		autogenerate_stylesheet: true,
		min_cols: self.opts.grid.cols,
		max_cols: self.opts.grid.cols,
		min_rows: self.opts.grid.rows,
		max_rows: self.opts.grid.rows,
		max_size_x: 3
	}
	var g = $('.grid').gridster(gridSettings).data('gridster');
	$('.grid').data('grid',g);
	$(window).on("resize",function(){
		self.resizeGrid();
	});
	$('.grid').on('mouseover', '.grid-item', (function(e){
		var card = $(e.target).closest('.grid-item');
		var time;
		card.addClass('full');
		clearTimeout(time);
		card.on('mouseout',(function(){ 
			clearTimeout(time);
			time = setTimeout(function(){
				$(e.target).closest('.grid-item').removeClass('full');
			},2000);
		}));
	}));
}

Veload.prototype.resizeGrid = function(){
	var ge = $('.grid');
	var g = ge.data('grid');
	//wait to let fullscreen transition happen (hacky)
	setTimeout(function(){
		$("body").toggleClass("fullscreen",window.innerHeight === screen.height);
		g.options.widget_base_dimensions = V.getWidgetSize();
		g.resize_responsive_layout();
		$(document).trigger("gridResized.veload");
	},500)
}
Veload.prototype.getAvailH = function(){
	var currNav = document.fullscreenElement ? 0 : $('nav.navbar').height();
	return $(window).height() - currNav -10;
	
}
Veload.prototype.getWidgetSize = function(){
	var availH = this.getAvailH() - (self.opts.grid.margY*(self.opts.grid.rows+1));
	var w = ($(window).width()-(self.opts.grid.margX*(self.opts.grid.cols+1))) / self.opts.grid.cols;
	var h = availH / self.opts.grid.rows;
	return [w,h]
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
				title: "command recognized"
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