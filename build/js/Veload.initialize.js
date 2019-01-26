const annyang = require("annyang");

// first thing loaded
Veload.prototype.loadInterface = function(){
	var self = this;
	// load required elements
	elements = ['modal','footer'];
	elements.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		self.cTemps[templ] = Handlebars.compile(src);	
	});	
	
	//ensure timers are ready to go so we can attach listeners;
	self.initTimers();
	
	if(window.location.pathname=="/dashboard"){
		self.loadDash();
	}	
	$('#modal-container').on('hidden.bs.modal','#modal',function(){
		console.log("destroying modal");
		$('#modal').modal('dispose');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	});	

	//wait until modules loaded before showing loaded
	$(document).on('modulesLoaded.veload',function(){
		$("body").removeClass("loading");				
	});		
	$(document).trigger('modulesLoading.veload');

	$.getJSON(self.remote.userLayout,function(modules){
		var modules = _.keyBy(modules[0], 'name');
		_.forEach(modules,function(obj,mod){
			self.enableModule(mod,obj);
		});

		self.loaded();
	})
}
Veload.prototype.loaded = function(){
	//native type here so modules don't have to depend upon jQuery custom events in the future	
	console.log('loaded.veload');
	var l = new CustomEvent('loaded.veload', {bubbles: true, cancelable: true});
	document.dispatchEvent(l);		
}

//second thing loaded
Veload.prototype.loadProfile = function(){
	var self = this;
	$.getJSON(self.remote.athlete,function(data){
		$("body").removeClass("loggedout").addClass("loggedin");
		self.athlete = data;
		$("#profile button").html('<img class="img-fluid rounded-circle" style="max-width:36px" src="' + self.athlete.profile +'" />');
	});	
}

//third thing loaded
Veload.prototype.loadDash = function(){
	var self = this;
	self.initVoice();
	self.poll();
	setInterval(function(){self.poll();},3000);
	self.initGrid();
	$('[data-toggle="tooltip"]').tooltip();
}

Veload.prototype.initGrid = function(){
	var self = this;
	var margX = 20;
	var margY = 20;
	var cols = 6;
	var rows = 4;
	var gridSettings = {
		widget_selector: '.grid-item',
		widget_base_dimensions: self.getWidgetSize(cols,rows,margX,margY),
		widget_margins: [margX,margY],
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
		min_cols: cols,
		max_cols: cols,
		min_rows: rows,
		max_rows: rows,
		max_size_x: 3
	}
	var g = $('.grid').gridster(gridSettings).data('gridster');
	$('.grid').data('grid',g);
	$(document).on("fullscreenchange",function(){
		//TODO: doesn't work
		$('.grid').data('grid').set_dom_grid_height($(window).height())
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
Veload.prototype.getWidgetSize = function(cols,rows,margX,margY){
	var availH = ($(window).height()-$('nav.navbar').height()-(margY*(rows+1))-20);
	var w = ($(window).width()-(margX*(cols+1))) / cols;
	var h = availH / rows;
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
				title: false,
				footer: false,
				body: `<div class='text-center'><div class='speech'>${userSaid}</div>${loadAni()}</div>`,
				accept: false,
				close: false
			}
			self.pop(config);
			setTimeout(function(){
				self.unpop();
			},3000);
		});

		// Start listening.
		annyang.start({ autoRestart: true });
	}
}