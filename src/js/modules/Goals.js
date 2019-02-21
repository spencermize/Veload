import _ from 'lodash';
import interact from 'interactjs';
import Muuri from 'muuri';

function Goals(opts){
	this.opts = opts;
	if (!(this instanceof Goals)) return new Goals(opts);
};
Goals.prototype.selectWorkoutTemplate = function(e){
	this.workout = _.find(this.workoutTemplates,{'id' : e.data("id")});
	this.makeGraphable();
}
Goals.prototype.makeGraphable = function(){
	var cumulative = 0;
	var self = this;
	this.workout.data.forEach(function(val,i){
		if(val.lengthType=="distance"){
			self.workout.data[i].x = cumulative
		}else if(val.lengthType=="minutes"){
			self.workout.data[i].x = cumulative * 60; //convert to seconds
		}
		self.workout.data[i].y = Number(val.value);
		cumulative += Number(val.length);		
	})
	$(document).trigger("workoutLoaded.veload");
}
Goals.prototype.getCurrent = function(){
	if(this.workout.lengthType == "distance"){
		var e = V.getDistance("meters",true);
	}else if(this.workout.lengthType == "minutes"){
		var e = V.getElapsed();
	}
	for(var i = 0; i<this.workout.data.length-1; i++){
		var val = this.workout.data[i];
		if(i == this.workout.data.length - 1){
			console.log("last goal!")
			return {type: this.workout.lengthType,value: val.y}
		}else if(e>=val.x && e<this.workout.data[i+1].x){
			console.log("current goal: " + val.y)
			return {
				lengthType: this.workout.lengthType,
				value: val.y,
				type:this.workout.type};
		}
	}
	console.log("current goal: 0")
	return 0;	
}
Goals.prototype.show = function(){
	V.loading();
	var self = this;
	var comp = V.cTemps.workoutBuilder(V.user);
	var popts = {
		title: "Workout Builder",
		body: comp,
		accept: true,
		acceptText: 'Save Workout Template',
		modalClass: "veload-goals",
		width: $(comp).find('.carousel-item.active').attr("data-max-width")
	}
	var events = {
		acceptClick: function(){
			self.save();
		}
	}
	V.unpop();
	V.pop(popts,events)
	$('[data-slide=prev]').addClass("d-none");
	$('#workout-builder').on('slide.bs.carousel', function (e) {
		$('#modal .modal-dialog').css("max-width",$(e.relatedTarget).attr("data-max-width"));
		
		//handle button visibility
		$('[data-slide],.btn-accept').removeClass('d-none');
		if(e.to == $(comp).find('.carousel-item').length - 1){
			$('[data-slide=next]').addClass("d-none");
		}
		if(e.to == 0){
			$('[data-slide=prev],.btn-accept').addClass("d-none");
		}
	})
	$('#workout-builder').on('slid.bs.carousel', function (e) {
		if($('#modal .carousel-item.active .goals-container').length){
			self.initGoalBuilder();
		}
	})
	

}
Goals.prototype.select = function(){
	V.loading();
	var self = this;
	$.getJSON(V.opts.urls.remote.userWorkoutTemplates,function(data){
		self.workoutTemplates = data;
		data.forEach(function(workout){ // each workout template
			var arr = [];
			var spark = [];
			var totalX = 0;
			var maxY = 0;	
			workout.data.forEach(function(dat){ // goal elements
				var l = Number(dat.length);
				var v = Number(dat.value);
				arr.push([l,v]);
				totalX += l;
				if(v>maxY){maxY=v}
			})
			arr.forEach(function(sp,i){
				var w = (sp[0] / totalX)*100;
				var h = (sp[1] / maxY)*100;
				spark.push([w,h]);
			});
			workout.spark = spark;

			if(workout.lengthType=="distance"){
				workout.lengthType = V.user.units;
				if(V.user.units == "miles"){
					workout.length = Math.round(V.opts.toBarbarian(workout.length));
				}else{
					workout.length = V.opts.toK(workout.length);
				}
			}
		})
		var comp = V.cTemps.workoutSelector(data);
		var popts = {
			title: "Workout Selector",
			body: comp,
			accept: false,
			modalClass: "veload-goals",
			width: "60vw"
		}
		V.unpop();
		V.pop(popts)	
	})

}
Goals.prototype.initGoalBuilder = function(){
	var self = this;
	self.itemCreated = false;
	self.fullGrid = $('.goals-container');
	self.minLimit = $('.item').css("min-height").replace(/\D+/,"");
	self.availY = self.fullGrid.height() - self.minLimit;
	self.availX = self.fullGrid.width();
	$('.goal-item-template').addClass('d-none');
	if(self.grid){
		self.grid.destroy(true);
	}
	self.grid = new Muuri('.goals-grid', {
		layout: {
			horizontal: true,
			alignBottom: true,
			rounding: true
		}
	});
	self.fullGrid.data('grid',self.grid);
	self.addGoal(true);

	self.inter = interact('.item', {
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
		.on('resizestart', function () {
			self.r = self.getResizeParams();
			self.itemCreated = true;
		})
		.on('resizemove', function (e) {
			var target = $(e.target);
			if(e.rect.height>self.minLimit && e.clientY>self.r.bBox.top && e.clientX<self.r.bBox.right){
				var msg = self.sizeGoal({
					width: 	e.rect.width,
					height: e.rect.height,
					target: e.target
				})
				self.updateTooltip(target,msg)
			}
			$('.length-display span').text(self.getLength());

			if (e.dx != 0 && e.dy === 0) {
				self.refresh(target[0]);
			}
		}).on('resizeend', function (e) {
			$(e.target).removeClass('resizing');
			self.refresh(e.target);
		})
}
Goals.prototype.getLength = function(){
	if(this.itemCreated){
		var l = 0;
		var type = ""
		$('.goals-grid .item').each(function(_i,el){
			var e = $(el).find(".item-content");
			l += Number(e.attr("data-metric-length")) || 0;
			type = e.attr("data-metric-length-type");
		})
		return `${l} ${type}`;
	}else{
		return 0;
	}
}
Goals.prototype.serialize = function(){
	var items = $('.goals-grid .item');
	var ser = {
		data : [],
		length: 0,
		title : $('.workout-title').val(),
		type : "",
		lengthType : ""
	};
	items.each(function(_i,el){
		console.log(el)
		var e = $(el).find('.item-content');
		var lengthType = e.attr("data-metric-length-type");
		var length = e.attr("data-metric-length");
		var type = e.attr("data-metric-type");
		if(lengthType=="miles"){
			length = V.opts.toMFromBarb(l);
			lengthType = "distance"
		}else if(lengthType=="kilometers"){
			length = V.opts.toM(l);
			lengthType = "distance"
		}
		ser.data[_i] ={
			value : e.attr("data-metric-value"),
			type : type,
			length : length,
			lengthType : lengthType
		}
		console.log(ser.value)
		ser.type = type;
		ser.lengthType = lengthType;
		ser.length += Number(length);
	})
	return ser;
}
Goals.prototype.deleteWorkoutTemplate = function(e){
	$.ajax({
		dataType: "json",
		method: "delete",
		url: `${V.opts.urls.remote.userWorkoutTemplates}/${e.data("id")}`,
		success: function(data){
			if(data.status == "success"){
				e.closest(".col-3").remove()
			}
			
		}
	})
}
Goals.prototype.save = function(){
	var title = $('.workout-title');
	if(title.val().length){
		V.loading()
		var ser = this.serialize();
		this.workout = ser;
		$.post(V.opts.urls.remote.workoutTemplate,ser,function(data){
			V.unpop();
			//V.pop({title: "Success!",body:"Workout template saved.",accept:false})
			$(document).trigger("workoutSaved.veload")
		})
	}else{
		title.addClass("is-invalid");
	}

}
Goals.prototype.getResizeParams = function(){
	var vari = $('.veload-goals .variable :checked').closest("[data-type]");
	var lengthUnit = $('.veload-goals .length-units :checked').closest("[data-type]");
	var lUnitMax = lengthUnit.attr("data-max");
	var increment = lengthUnit.attr("data-increment");
	return {
		decimal : vari.attr("data-decimal"),
		bBox : $('.goals-container')[0].getBoundingClientRect(),
		max : vari.attr("data-max"),
		min : vari.attr("data-min"),
		unit : vari.attr("data-unit"),
		lUnit : lengthUnit.attr("data-type"),
		lUnitMin : lengthUnit.attr("data-min"),
		lUnitMax : lUnitMax,
		lUnitDecimal: lengthUnit.attr("data-decimal"),
		increment : increment,
		type : vari.attr("data-type"),
		totalX : (lUnitMax / increment) * lUnitMax
	}
}
Goals.prototype.sizeGoal = function(params){
	var percentY = (params.height - this.minLimit) / this.availY;
	var percentX = params.width / this.availX;
	var numberPer = 1 / this.r.increment;
	var absY = Number(((this.r.max - this.r.min) * percentY) + this.r.min).toFixed(this.r.decimal); //actual hr/speed/cadence value
	var ticksX = Math.round((this.r.lUnitMax - this.r.lUnitMin) * percentX * numberPer);
	var absX = (ticksX / numberPer).toFixed(this.r.lUnitDecimal); //actual time/distance value
	var absXStr = absX > 0 ? `${absX} ${this.r.lUnit}` : `1 ${this.r.lUnit}`;
	var target = $(params.target);
	var child = target.find(".item-content");

	child.attr("data-metric-value",absY);
	child.attr("data-metric-type",this.r.type);
	child.attr("data-metric-length",absX);
	child.attr("data-metric-length-type",this.r.lUnit)

	var transform = target[0].style.transform.replace(/(translateY\()(-?\d+(?=px))/, `$1-${Math.floor(params.height)}`);

	target.css({ "width": params.width + 'px', "height": params.height + 'px', 'transform': transform }).addClass('resizing');	
	return `${absY} ${this.r.unit} for ${absXStr}`;	
}
Goals.prototype.paramsToSize = function(params){
	var percentY = params.absY / this.r.min;
	var actualY = Math.ceil(percentY * this.AvailY);

	var percentX = params.absX / this.r.lUnitMin;
	var actualX = Math.ceil(percentX * this.AvailX);

	return[actualX,actualY]
}
Goals.prototype.updateTooltip = function(target,msg,reset){
	var t = $(target);
	t.attr("title", msg)
	if(reset){
		$('[data-toggle="tooltip"]').tooltip('disable').tooltip('dispose').tooltip();;
	}else{
		t.attr('data-original-title', msg);
		t.tooltip("show");	
	}
}
Goals.prototype.removeGoal = function(e){
	$(e).closest(".item").remove();
	this.refresh();
}
Goals.prototype.addGoal = function(vari){
	var temp =$('.goal-item-template').clone().removeClass('d-none').children() // brand new
	var nw;
	var w = temp.width();
	var h = temp.height();

	if(vari===true){ //adding the first element;
		this.r = this.getResizeParams();
		nw = temp;		
		nw.find('.closer').addClass("d-none");
	}else if($(vari).hasClass('item')){
		console.log("looks like we're cloning!")
		nw = $(vari); //clone
		nw.find(".closer").removeClass("d-none");
		this.updateTooltip(nw,msg,true);
			
	}else if(false){
		var size = this.paramsToSize({
			absY: nw.attr("data-metric-value"),
			absX: nw.attr("data-metric.length")
		})
		console.log(size)
		w = size[0];
		h = size[1];
		nw.height(h);
		nw.width(w);
		var msg = this.sizeGoal({
			width: 	w,
			height: h,
			target: nw
		});			
	}else{
		nw = temp; // brand new
	}
	
	//add the new element to the grid
	this.grid.add(nw[0]);

	//check to make sure the sizing is proper
	if(!nw.find(".item-content").attr("data-metric-value")){
		console.log(nw)
		var msg = this.sizeGoal({
			width: 	nw.width(),
			height: nw.height(),
			target: nw
		});	
	}

	//refresh the grid
	this.grid.refreshItems().layout();

	$('.length-display span').text(this.getLength());
}
Goals.prototype.cloneGoal = function(e){
	this.addGoal($(e).closest(".item").clone())
	this.refresh();
}
Goals.prototype.refresh = function(item){
	if(this.grid){
		var i = item || null;
		this.grid.refreshItems(i).layout();
	}
}

export { Goals };