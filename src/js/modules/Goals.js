import _ from 'lodash';
import interact from 'interactjs';
import Muuri from 'muuri';

function Goals(opts){
	this.opts = opts;
	if (!(this instanceof Goals)) return new Goals(opts);
};

Goals.prototype.show = function(){
	V.loading();
	var self = this;
	var comp = V.cTemps.goals(V.user);
	var popts = {
		title: "Goal Builder",
		body: comp,
		accept: true,
		modalClass: "veload-goals",
		width: '80vw'
	}
	var events = {
		acceptClick: function(){
			console.log(self.serialize());
		}
	}
	self.itemCreated = false;
	V.unpop();
	V.pop(popts,events)

	$('#modal-container').one('shown.bs.modal', '#modal', function () {
		self.fullGrid = $('.goals-container');
		self.minLimit = $('.item').css("min-height").replace(/\D+/,"");
		self.availY = self.fullGrid.height() - self.minLimit;
		self.availX = self.fullGrid.width();
		$('.goal-item-template').addClass('d-none');
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
		})

			.resizable({
				edges: {
					top: true,
					left: false,
					bottom: false,
					right: true
				},
				restrictEdges: {
					restriction: $('.goals-container')[0]
				},
				inertia: false,
				snap: {
					endOnly: true
				}
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
				console.log('updating')
				$('.length-display span').text(self.getLength());

				if (e.dx != 0 && e.dy === 0) {
					self.refresh(target[0]);
				}
			}).on('resizeend', function (e) {
				$(e.target).removeClass('resizing');
				self.refresh(e.target);
			})

	});
}
Goals.prototype.getLength = function(){
	if(this.itemCreated){
		var l = 0;
		var type = ""
		$('.goals-grid .item').each(function(_i,el){
			var e = $(el).find(".item-content");
			l += Number(e.attr("data-metric-length")) || 0;
			type = e.data("metric-length-type");
		})
		return `${l} ${type}`;
	}else{
		return 0;
	}
}
Goals.prototype.serialize = function(){
	var ser = [];
	this.grid.getItems().forEach(function(el){
		console.log(el.getElement())
		var e = $(el.getElement()).find(".item-content");
		ser.push({
			value : e.data("metric-value"),
			type : e.data("metric-type"),
			length : e.data("metric-length"),
			lengthType : e.data("metric-length-type")
		})
	})
	return ser;
}
Goals.prototype.getResizeParams = function(){
	var vari = $('.veload-goals .variable').find(":selected");
	var lengthUnit = $('.veload-goals .length-units').find(":selected");
	var lUnitMax = lengthUnit.data("max");
	var increment = lengthUnit.data("increment");
	return {
		decimal : vari.data("decimal"),
		bBox : $('.goals-container')[0].getBoundingClientRect(),
		max : vari.data("max"),
		min : vari.data("min"),
		unit : vari.data("unit"),
		lUnit : lengthUnit.data("type"),
		lUnitMin : lengthUnit.data("min"),
		lUnitMax : lUnitMax,
		lUnitDecimal: lengthUnit.data("decimal"),
		increment : increment,
		type : vari.data("type"),
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

		this.updateTooltip(nw,msg,true);
			
	}else if(false){
		var size = this.paramsToSize({
			absY: nw.data("metric-value"),
			absX: nw.data("metric.length")
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
	if(!nw.find(".item-content").data("metric-value")){
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