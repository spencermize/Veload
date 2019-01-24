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

	//wait until modules loaded before showing loaded
	$(document).on('vAllModulesLoaded',function(){
		$("body").removeClass("loading");				
	});		
	$(document).trigger('vModulesLoading');
	$.getJSON(self.remote.userLayout,function(modules){
		var modules = _.keyBy(modules, 'name');
		_.forEach(modules,function(obj,mod){
			if(obj.status=="true"){
				self.enableModule(mod);
			}
			
		});
		//native type here so modules don't have to depend upon jQuery custom events in the future
	self.loaded();
	})
}
Veload.prototype.loaded = function(){
	var veloaded = new CustomEvent('veloaded', {bubbles: true, cancelable: true});
	document.dispatchEvent(veloaded);		
}
Veload.prototype.enableModule = function(mod){
	// load modules
	var modulesLoad = [];
	
	self.enabledMods.push(mod);
	var name = mod+"-module";
	var el = document.getElementById(name);
	var src = el.innerHTML;
	var initEvent = `${mod}ModuleLoaded`;
	var finishedEvent = `${mod}Loaded`;
	
	modulesLoad.push(finishedEvent);
	self.cMods[mod] = Handlebars.compile(src);
	$('.grid').append(self.cMods[mod]());	
	$(document).on(initEvent,function(){
		//console.log(initEvent);
		self[mod]();
	});
	$(document).on(finishedEvent,function(){
		//console.log(finishedEvent);
		_.remove(modulesLoad,function(e){
			return e == finishedEvent;
		});
		//console.log(modulesLoad);
		if(modulesLoad.length==0){
			$(document).trigger('vAllModulesLoaded');
			console.log('vAllModulesLoaded');
		}
	});
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
	$(document).on('vAllModulesLoaded',function(){
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
			draggie.on("dragEnd",function(){
				var data = [];
				$(self.$grid.packery('getItemElements')).each(function(index,el){
					var el = $(el);
					var n = el.data('name');
					var conf = {
							name : n,
							status: el.find('.btn-toggle').hasClass('active'),
							top: el.css('top'),
							left: el.css('left')
						}
					data.push(conf)
					console.log(data);
				})
				$.post(self.remote.userLayout,{layout:data},function(data){
					console.log(data);
				});
			});
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
	});
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