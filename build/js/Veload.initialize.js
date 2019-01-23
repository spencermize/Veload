const annyang = require("annyang");

// first thing loaded
Veload.prototype.loadInterface = function(){
	var self = this;
	// load required elements
	elements = ['modal','footer'];
	
	//ensure timers are ready to go so we can attach listeners;
	self.initTimers();
	
	elements.forEach(function(templ){
		var src = document.getElementById(`${templ}-temp`).innerHTML;
		self.cTemps[templ] = Handlebars.compile(src);	
	});
	$('#modal-container').on('hidden.bs.modal','#modal',function(){
		console.log("removing stuff");
		$('#modal').modal('dispose');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	});	
	// load modules
	if(typeof modules !== 'undefined'){
		var self = this;
		var modulesLoad = [];		
		
		//wait until modules loaded before showing loaded
		$(document).on('vAllModulesLoaded',function(){
			var els = $("#modal,.modal-backdrop");
			els.fadeOut(500,function(el){
				els.remove();
				$("body").removeClass("loading");				
			})
		});		
		$(document).trigger('vModulesLoading');

		modules.forEach(function(mod){
			var name = mod+"-module";
			var el = document.getElementById(name);
			var src = el.innerHTML;
			var initEvent = `${mod}ModuleLoaded`;
			var finishedEvent = `${mod}Loaded`;
			modulesLoad.push(finishedEvent);
			self.cMods[mod] = Handlebars.compile(src);
			$('.grid').append(self.cMods[mod]());	
			$(document).on(initEvent,function(){
				console.log(initEvent);
				self[mod]();
			});
			$(document).on(finishedEvent,function(){
				console.log(finishedEvent);
				_.remove(modulesLoad,function(e){
					return e == finishedEvent;
				});
				console.log(modulesLoad);
				if(modulesLoad.length==0){
					$(document).trigger('vAllModulesLoaded');
					console.log('vAllModulesLoaded');
				}
			});			
			
		});
		$("[data-submodule]").each(function(index,sub){
			var src = $("#"+$(sub).data("submodule")+"-sub").html();
			var cmp = Handlebars.compile(src);
			$(sub).closest(".grid-item").find(".card-body").html(cmp);
		});
	}else{
		//just stop loading now;
		self.unpop();	
	}
	
	//native type here so modules don't have to depend upon jQuery custom events in the future
	var veloaded = new CustomEvent('veloaded', {bubbles: true, cancelable: true});
	document.dispatchEvent(veloaded);
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
	self.$grid = $('.grid').packery({
		itemSelector: '.grid-item',
		percentPosition: true,
		columnWidth: '.col-lg-2',
	})
	self.$grid.find('.grid-item').each( function( i, gridItem ) {
		var draggie = new Draggabilly( gridItem,{
			handle: ".card-header"
		});
		self.$grid.packery( 'bindDraggabillyEvents', draggie );
	});
	self.$grid.on( 'dblclick', '.grid-item .card-header', function( event ) {
		var $item = $( event.currentTarget ).closest('.grid-item');
		$item.toggleClass('col-lg-8');
		self.$grid.packery('layout');
	});
	self.$grid.on('mouseover', '.grid-item', (function(e){
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