import _ from 'lodash';
import '../../third_party/gridster/jquery.gridster.min.js';
import { Options } from './Options.js';

function Grid(){
	this.margX = 10;
	this.margY = 10;
	this.cols = 6;
	this.rows = 4;
	this.enabledMods = [];
	this.modLoadQueue = [];
	if (!(this instanceof Grid)){
		return new Grid();
	}
}

Grid.prototype.moduleToggle = function(ele){
	var e = $(ele);
	var el = e.closest('[data-name]');
	if (e.closest('.btn-toggle').hasClass('active')){
		this.enableModule(el.data('name'));
		this.saveLayout();
	} else {
		this.disableModule(el);
	}
};
Grid.prototype.disableModule = function(mod){
	var self = this;
	var el;
	if (mod.hasClass('grid-item')){
		el = mod;
	} else {
		el = $(`.grid-item[data-name=${mod.data('name')}]`);
	}

	if (el.length){
		el.fadeOut(400,function(){
			_.pull(self.enabledMods,mod.data('name'));
			$('.grid').data('grid').remove_widget(el);
			self.saveLayout();
		});
	} else {
		_.pull(self.enabledMods,mod);
	}
};

Grid.prototype.enableModule = function(mod,cnf){
	if (mod){
		this.enabledMods.push(mod);
		var mob = {};
		var def = {
			size_x: 1,
			size_y: 1,
			col: 1,
			row: 1
		};
		//try to shrink for mobile
		if ($(window).width() < 1000){
			mob = _.cloneDeep(def);
		}
		const config = Object.assign(def,cnf,mob,V.user);
		var name = mod + '-module';
		var el = document.getElementById(name);
		if (el){
			var src = el.innerHTML;
			var comp = Handlebars.compile(src)(config);
			var jcomp = $(comp);
			var finishedEvent = `initialized.${mod}`;

			if (jcomp.data('script').trim() !== 'ignore'){
				this.listenForFinish(finishedEvent);
			}

			$('.grid').data('grid').add_widget(comp,config.size_x,config.size_y,config.col,config.row);
			if (jcomp.data('script') === true && !window[_.upperFirst(mod)]){
				$.getScript(`/js/_${mod}.js`,function(){
					//call constructor if necessary
					if (window[_.upperFirst(mod)]){
						window[_.upperFirst(mod)]();
					}
				});
			} else if (jcomp.data('script') === true){
				//script already loaded
				window[_.upperFirst(mod)]();
			}
			$(document).trigger(`enabling.${mod}`);
		} else {
			throw Error(`Unable to load module: ${mod}`);
		}
	}
};

Grid.prototype.saveLayout = function(){
	var data = [];
	var e = $('.grid').data('grid');
	e = e.serialize();
	_.forEach(e,function(el,index){
		var dom = $(`.grid-item:nth-of-type(${index + 1})`);
		e[index]['name'] = dom.data('name');
		e[index]['title'] = _.trim(dom.data('title'));
		e[index]['type'] = dom.find('[data-chart]').data('chart');
		e[index]['param'] = dom.find('[data-param]').data('param');
		e[index]['listen'] = dom.find('[data-listen]').data('listen');
	});
	data.push(e);
	$.post(Options.urls.remote.userLayout,{ value: data },function(){

	});
};
Grid.prototype.initGrid = function(){
	$(document).trigger('loading.grid');
	var self = this;
	var gridSettings = {
		widget_selector: '.grid-item',
		widget_base_dimensions: self.getWidgetSize(),
		widget_margins: self.getWidgetMargins(),
		draggable: {
			stop: function(){
				self.saveLayout();
			},
			handle: '.card-header'
		},
		shift_widgets_up: false,
		resize: {
			enabled: true,
			stop: function(e){
				self.saveLayout();
				$(document).trigger(`gridItemResized.${$(e.target).closest('.grid-item').data('name')}`);
			}
		},
		autogenerate_stylesheet: true,
		min_cols: self.cols,
		max_cols: self.cols,
		min_rows: self.rows,
		max_rows: self.rows,
		max_size_x: 3
	};
	var g = $('.grid').gridster(gridSettings).data('gridster');
	$('.grid').data('grid',g);
	$(window).on('resize',function(){
		self.resizeGrid();
	});
	$('.grid').on('mouseover','.grid-item',function(e){
		var card = $(e.target).closest('.grid-item');
		var time;
		card.addClass('full');
		clearTimeout(time);
		card.on('mouseout',function(){
			clearTimeout(time);
			time = setTimeout(function(){
				$(e.target).closest('.grid-item').removeClass('full');
			},2000);
		});
	});
	$(document).trigger('loaded.grid');
};

Grid.prototype.resizeGrid = function(){
	var self = this;
	var ge = $('.grid');
	var g = ge.data('grid');
	//wait to let fullscreen transition happen (hacky)
	setTimeout(function(){
		$('body').toggleClass('fullscreen',window.innerHeight === screen.height);
		g.options.widget_base_dimensions = self.getWidgetSize();
		g.resize_responsive_layout();
		$(document).trigger('gridResized.veload');
	},500);
};
Grid.prototype.getAvailH = function(){
	var currNav = document.fullscreenElement ? 0 : $('nav.navbar').height();
	return $(window).height() - currNav - 10;
};
Grid.prototype.getWidgetMargins = function(){
	return [this.margX,this.margY];
};
Grid.prototype.getWidgetSize = function(){
	var availH = this.getAvailH() - (this.margY * (this.rows + 1));
	if ($(window).width() < 1000){
		this.margX = 5;
		this.cols = 3;
	}
	if ($(window).width() < 500){
		this.margX = 5;
		this.cols = 2;
	}
	if ($(window).height() < 800){
		this.margY = 5;
		this.rows = 2;
	}
	if ($(window).height() < 500){
		this.margY = 5;
		this.rows = 2;
	}
	var w = ($(window).width() - (this.margX * (this.cols + 1))) / this.cols;
	var h = availH / this.rows;
	return [w,h];
};

Grid.prototype.listenForFinish = function(finishedEvent){
	var self = this;
	self.modLoadQueue.push(finishedEvent);
	$(document).one(finishedEvent,function(){
		_.pull(self.modLoadQueue,finishedEvent);
		if (self.modLoadQueue.length === 0){
			$(document).trigger('modulesLoaded.grid');
		}
	});
};
export let grid = new Grid();
