import _ from 'lodash';
function Grid(){
	Veload.prototype.moduleToggle = function(ele){
		var e = $(ele);
		var el = e.closest('[data-name]');
		if (e.closest('.btn-toggle').hasClass('active')){
			self.enableModule(el.data('name'));
			self.saveLayout();
		} else {
			self.disableModule(el);
		}
	};
	Veload.prototype.disableModule = function(mod){
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

	Veload.prototype.enableModule = function(mod,cnf){
		if (mod){
			V.enabledMods.push(mod);
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
			const config = Object.assign(def,cnf,mob);
			var name = mod + '-module';
			var el = document.getElementById(name);
			if (el){
				var src = el.innerHTML;
				var comp = Handlebars.compile(src)(config);

				var finishedEvent = `initialized.${mod}`;

				self.listenForFinish(finishedEvent);
				$('.grid').data('grid').add_widget(comp,config.size_x,config.size_y,config.col,config.row);
				if ($(comp).data('script') && !window[_.upperFirst(mod)]){
					$.getScript(`/js/_${mod}.js`,function(){
						//call constructor if necessary
						if (window[_.upperFirst(mod)]){
							window[_.upperFirst(mod)]();
						}
					});
				} else if ($(comp).data('script')){
					//script already loaded
					window[_.upperFirst(mod)]();
				}
				this.loaded();
			} else {
				V.disableModule(name);
			}
		}
	};

	Veload.prototype.saveLayout = function(){
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
		$.post(self.opts.urls.remote.userLayout,{ value: data },function(){

		});
	};
	Veload.prototype.initGrid = function(){
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
			min_cols: self.opts.grid.cols,
			max_cols: self.opts.grid.cols,
			min_rows: self.opts.grid.rows,
			max_rows: self.opts.grid.rows,
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
	};

	Veload.prototype.resizeGrid = function(){
		var ge = $('.grid');
		var g = ge.data('grid');
		//wait to let fullscreen transition happen (hacky)
		setTimeout(function(){
			$('body').toggleClass('fullscreen',window.innerHeight === screen.height);
			g.options.widget_base_dimensions = V.getWidgetSize();
			g.resize_responsive_layout();
			$(document).trigger('gridResized.veload');
		},500);
	};
	Veload.prototype.getAvailH = function(){
		var currNav = document.fullscreenElement ? 0 : $('nav.navbar').height();
		return $(window).height() - currNav - 10;
	};
	Veload.prototype.getWidgetMargins = function(){
		return [self.opts.grid.margX,self.opts.grid.margY];
	};
	Veload.prototype.getWidgetSize = function(){
		var availH = this.getAvailH() - (self.opts.grid.margY * (self.opts.grid.rows + 1));
		if ($(window).width() < 1000){
			self.opts.grid.margX = 5;
			self.opts.grid.cols = 3;
		}
		if ($(window).width() < 500){
			self.opts.grid.margX = 5;
			self.opts.grid.cols = 2;
		}
		if ($(window).height() < 800){
			self.opts.grid.margY = 5;
			self.opts.grid.rows = 2;
		}
		if ($(window).height() < 500){
			self.opts.grid.margY = 5;
			self.opts.grid.rows = 2;
		}
		var w = ($(window).width() - (self.opts.grid.margX * (self.opts.grid.cols + 1))) / self.opts.grid.cols;
		var h = availH / self.opts.grid.rows;
		return [w,h];
	};
}

export { Grid };
