import _ from 'lodash';
import interact from 'interactjs';
import Muuri from 'muuri';
import Options from './Options.js';
import Templates from './Templates.js';
import Modals from './Modals.js';
import * as Trail from './Utils.Trail.js';

function Goals(){
	V.Goals = this;
	if (!(this instanceof Goals)){
		return new Goals();
	}
}
Goals.prototype.selectWorkoutTemplate = function(e){
	this.workout = _.find(this.workoutTemplates,{ 'id': e.data('id') });
	this.makeGraphable();
};
Goals.prototype.makeGraphable = function(){
	var cumulative = 0;
	var self = this;
	this.workout.data.forEach(function(val,i){
		if (val.lengthType == 'distance'){
			self.workout.data[i].x = cumulative;
		} else if (val.lengthType == 'minutes'){
			self.workout.data[i].x = cumulative * 60; //convert to seconds
		}
		self.workout.data[i].y = Number(val.value);
		cumulative += Number(val.length);
	});
	$(document).trigger('workoutLoaded.veload');
};
Goals.prototype.getCurrent = function(){
	var e;
	if (this.workout.lengthType == 'distance'){
		e = Trail.getDistance('meters');
	} else if (this.workout.lengthType == 'minutes'){
		e = Trail.getElapsed();
	}
	for (var i = 0; i < this.workout.data.length - 1; i++){
		var val = this.workout.data[i];
		if (i == this.workout.data.length - 1){
			return { type: this.workout.lengthType,value: val.y };
		} else if (e >= val.x && e < this.workout.data[i + 1].x){
			return {
				lengthType: this.workout.lengthType,
				value: val.y,
				type: this.workout.type };
		}
	}
	return 0;
};
Goals.prototype.show = function(){
	V.loading();
	var self = this;
	var comp = Templates.get('workoutBuilder')(V.user);
	var popts = {
		title: 'Workout Builder',
		body: comp,
		accept: true,
		acceptText: 'Save Workout Template',
		modalClass: 'veload-goals',
		width: $(comp).find('.carousel-item.active').attr('data-max-width')
	};
	var events = {
		acceptClick: function(){
			self.save();
		}
	};
	Modals.unpop();
	Modals.pop(popts,events);
	$('[data-slide=prev]').addClass('d-none');
	$('#workout-builder').on('slide.bs.carousel',function(e){
		$('#modal .modal-dialog').css('max-width',$(e.relatedTarget).attr('data-max-width'));

		//handle button visibility
		$('[data-slide],.btn-accept').removeClass('d-none');
		if (e.to == $(comp).find('.carousel-item').length - 1){
			$('[data-slide=next]').addClass('d-none');
		}
		if (e.to == 0){
			$('[data-slide=prev],.btn-accept').addClass('d-none');
		}
	});
	$('#workout-builder').on('slid.bs.carousel',function(){
		if ($('#modal .carousel-item.active .goals-container').length){
			self.initGoalBuilder();
		}
	});
};
Goals.prototype.select = function(){
	V.loading();
	var self = this;
	$.getJSON(Options.urls.remote.userWorkoutTemplates,function(data){
		self.workoutTemplates = data;
		data.forEach(function(workout){ //each workout template
			var arr = [];
			var spark = [];
			var totalX = 0;
			var maxY = 0;
			workout.data.forEach(function(dat){ //goal elements
				var l = Number(dat.length);
				var v = Number(dat.value);
				arr.push([l,v]);
				totalX += l;
				if (v > maxY){ maxY = v; }
			});
			arr.forEach(function(sp){
				var w = (sp[0] / totalX) * 100;
				var h = (sp[1] / maxY) * 100;
				spark.push([w,h]);
			});
			workout.spark = spark;

			if (workout.lengthType == 'distance'){
				if (V.user.units == 'miles'){
					workout.length = Math.round(Options.toBarbarian(workout.length));
				} else {
					workout.length = Options.toK(workout.length);
				}
			}
		});
		var comp = Templates.get('workoutSelector')(data);
		var popts = {
			title: 'Workout Selector',
			body: comp,
			accept: false,
			modalClass: 'veload-goals',
			width: '60vw'
		};
		Modals.unpop();
		Modals.pop(popts);
	});
};
Goals.prototype.initGoalBuilder = function(){
	var self = this;
	self.itemCreated = false;
	self.fullGrid = $('.goals-container');
	self.minLimit = $('.item').css('min-height').replace(/\D+/,'');
	self.availY = self.fullGrid.height() - self.minLimit;
	self.availX = self.fullGrid.width();
	$('.goal-item-template').addClass('d-none');
	if (self.grid){
		self.grid.destroy(true);
	}
	self.grid = new Muuri('.goals-grid',{
		layout: {
			horizontal: true,
			alignBottom: true,
			rounding: true
		}
	});
	self.fullGrid.data('grid',self.grid);
	self.addGoal(true);

	self.inter = interact('.item',{
		context: document.querySelector('.goals-grid')
	}).resizable({
		edges: {
			top: true,
			left: false,
			bottom: false,
			right: true
		},
		inertia: false
	})
		.on('resizestart',function(){
			self.r = self.getResizeParams();
			self.itemCreated = true;
		})
		.on('resizemove',function(e){
			var target = $(e.target);
			if (e.rect.height > self.minLimit && e.clientY > self.r.bBox.top && e.clientX < self.r.bBox.right){
				var msg = self.sizeGoal({
					width: e.rect.width,
					height: e.rect.height,
					target: e.target
				});
				self.updateTooltip(target,msg);
			}
			$('.length-display span').text(self.getLength());

			if (e.dx != 0 && e.dy === 0){
				self.refresh(target[0]);
			}
		}).on('resizeend',function(e){
			$(e.target).removeClass('resizing');
			self.refresh(e.target);
		});
};
Goals.prototype.getLength = function(){
	if (this.itemCreated){
		var l = 0;
		var type = '';
		$('.goals-grid .item').each(function(_i,el){
			var e = $(el).find('.item-content');
			l += Number(e.attr('data-metric-length')) || 0;
			type = e.attr('data-metric-length-type');
		});
		return `${l} ${type}`;
	} else {
		return 0;
	}
};
Goals.prototype.serialize = function(){
	var items = $('.goals-grid .item');
	var ser = {
		data: [],
		length: 0,
		title: $('.workout-title').val(),
		type: '',
		lengthType: ''
	};
	items.each(function(_i,el){
		var e = $(el).find('.item-content');
		var lengthType = e.attr('data-metric-length-type');
		var length = e.attr('data-metric-length');
		var type = e.attr('data-metric-type');
		if (lengthType == 'miles'){
			length = Options.toMFromBarb(length);
			lengthType = 'distance';
		} else if (lengthType == 'kilometers'){
			length = Options.toM(length);
			lengthType = 'distance';
		}
		ser.data[_i] = {
			value: e.attr('data-metric-value'),
			type: type,
			length: length,
			lengthType: lengthType
		};
		ser.type = type;
		ser.lengthType = lengthType;
		ser.length += Number(length);
	});
	return ser;
};
Goals.prototype.deleteWorkoutTemplate = function(e){
	$.ajax({
		dataType: 'json',
		method: 'delete',
		url: `${Options.urls.remote.userWorkoutTemplates}/${e.data('id')}`,
		success: function(data){
			if (data.status == 'success'){
				e.closest('.col-3').remove();
			}
		}
	});
};
Goals.prototype.save = function(){
	var title = $('.workout-title');
	if (title.val().length){
		V.loading();
		var ser = this.serialize();
		this.workout = ser;
		$.post(Options.urls.remote.workoutTemplate,ser,function(){
			Modals.unpop();
			$(document).trigger('workoutSaved.veload');
		});
	} else {
		title.addClass('is-invalid');
	}
};
Goals.prototype.getResizeParams = function(){
	var vari = $('.veload-goals .variable :checked').closest('[data-type]');
	var lengthUnit = $('.veload-goals .length-units :checked').closest('[data-type]');
	var lUnitMax = lengthUnit.attr('data-max');
	var increment = lengthUnit.attr('data-increment');
	return {
		decimal: vari.attr('data-decimal'),
		bBox: $('.goals-container')[0].getBoundingClientRect(),
		max: vari.attr('data-max'),
		min: vari.attr('data-min'),
		unit: vari.attr('data-unit'),
		lUnit: lengthUnit.attr('data-type'),
		lUnitMin: lengthUnit.attr('data-min'),
		lUnitMax: lUnitMax,
		lUnitDecimal: lengthUnit.attr('data-decimal'),
		increment: increment,
		type: vari.attr('data-type'),
		totalX: (lUnitMax / increment) * lUnitMax
	};
};
Goals.prototype.sizeGoal = function(params){
	var percentY = (params.height - this.minLimit) / this.availY;
	var percentX = params.width / this.availX;
	var numberPer = 1 / this.r.increment;
	var absY = Number(((this.r.max - this.r.min) * percentY) + this.r.min).toFixed(this.r.decimal); //actual hr/speed/cadence value
	var ticksX = Math.round((this.r.lUnitMax - this.r.lUnitMin) * percentX * numberPer);
	var absX = (ticksX / numberPer).toFixed(this.r.lUnitDecimal); //actual time/distance value
	var absXStr = absX > 0 ? `${absX} ${this.r.lUnit}` : `1 ${this.r.lUnit}`;
	var target = $(params.target);
	var child = target.find('.item-content');

	child.attr('data-metric-value',absY);
	child.attr('data-metric-type',this.r.type);
	child.attr('data-metric-length',absX);
	child.attr('data-metric-length-type',this.r.lUnit);

	var transform = target[0].style.transform.replace(/(translateY\()(-?\d+(?=px))/,`$1-${Math.floor(params.height)}`);

	target.css({ 'width': params.width + 'px','height': params.height + 'px','transform': transform }).addClass('resizing');
	return `${absY} ${this.r.unit} for ${absXStr}`;
};
Goals.prototype.paramsToSize = function(params){
	var percentY = params.absY / this.r.min;
	var actualY = Math.ceil(percentY * this.AvailY);

	var percentX = params.absX / this.r.lUnitMin;
	var actualX = Math.ceil(percentX * this.AvailX);

	return [actualX,actualY];
};
Goals.prototype.updateTooltip = function(target,msg,reset){
	var t = $(target);
	t.attr('title',msg);
	if (reset){
		$('[data-toggle="tooltip"]').tooltip('disable').tooltip('dispose').tooltip();
	} else {
		t.attr('data-original-title',msg);
		t.tooltip('show');
	}
};
Goals.prototype.removeGoal = function(e){
	$(e).closest('.item').remove();
	this.refresh();
};
Goals.prototype.addGoal = function(vari){
	var temp = $('.goal-item-template').clone().removeClass('d-none').children(); //brand new
	var nw;

	if (vari === true){ //adding the first element;
		this.r = this.getResizeParams();
		nw = temp;
		nw.find('.closer').addClass('d-none');
	} else if ($(vari).hasClass('item')){
		nw = $(vari); //clone
		nw.find('.closer').removeClass('d-none');
		this.updateTooltip(nw,'',true);
	} else {
		nw = temp; //brand new
	}

	//add the new element to the grid
	this.grid.add(nw[0]);

	//check to make sure the sizing is proper
	if (!nw.find('.item-content').attr('data-metric-value')){
		var msg = this.sizeGoal({
			width: nw.width(),
			height: nw.height(),
			target: nw
		});
		this.updateTooltip(nw,msg,true);
	}

	//refresh the grid
	this.grid.refreshItems().layout();

	$('.length-display span').text(this.getLength());
};
Goals.prototype.cloneGoal = function(e){
	this.addGoal($(e).closest('.item').clone());
	this.refresh();
};
Goals.prototype.refresh = function(item){
	if (this.grid){
		var i = item || null;
		this.grid.refreshItems(i).layout();
	}
};

export { Goals };
