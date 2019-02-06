import _ from 'lodash';
import interact from 'interactjs';
import hammerjs from 'hammerjs';
import Muuri from 'muuri';
V.Goals = Goals;
function Goals(){
	V.loading();
	var config = {

	}
	var comp = self.cTemps.goals(config);
	var popts = {
		title: "Goal Builder",
		body: comp,
		accept: false,
		modalClass: "veload-goals"
	}
	V.unpop();
	V.pop(popts)
/*	$('.goals-grid').gridster({

	})*/

	$('#modal-container').one('shown.bs.modal','#modal',function(){
		var grid = new Muuri('.goals-grid',{
			layout: {
				horizontal: true,
				alignBottom: true,
				rounding: true
			}
		});
		var targets = interact.createSnapGrid({
			x: 50,
			y: 50,
			range: 10
		})
		interact('.item', {
			context: document.querySelector('.goals-grid')
		  })

		 .resizable({
			edges: {
				top   : true,   
				left  : false,  
				bottom: false,  
				right : true    
			  },
			  restrictEdges:{
				restriction: '.goals-container'
			  },
			  snap:{
				  endOnly: true
			  }		  
		  }).on('resizemove', function (e) {
			var fullGrid = $('.goals-container');
			var availY = fullGrid.height();
			var availX = fullGrid.width();
			var target = $(e.target);
			var targetContent =  target.find(".item-content");
			var vari = $('.veload-goals .variable').find(":selected");
			var max = vari.data("max");
			var min = vari.data("min");
			var unit = vari.data("unit");
			const increment = 1;
			const minutes = 120;
			const totalX = (60 / increment) * minutes;
			var percentY = e.rect.height / availY;
			var percentX = e.rect.width / availX;
			var absY = Number(((max - min) * percentY) + min).toFixed(vari.data("decimal"));
			var absX = Number((totalX * percentX) / 60).toFixed(2);
			var absXMinutes = Math.floor(absX) > 0 ? Math.floor(absX) + " minutes <br />" : "";
			//var absXSeconds = (Math.round((absX % 1 * 60) / 15) * 15) + " seconds";
			// update the element's style
			var transform = target[0].style.transform.replace(/(translateY\()(-?\d+(?=px))/,`$1-${e.rect.height}`);

			target.css({"width":e.rect.width + 'px',"height":e.rect.height + 'px','transform':transform}).addClass('resizing');
			targetContent.html(`${absY} ${unit}<br />${absXMinutes}`)

			if(e.dx!=0 && e.dy===0){
				grid.refreshItems(target[0]).layout()
			}
		  }).on('resizeend',function(e){
			$(e.target).removeClass('resizing');
			grid.refreshItems(e.target).layout()
		  })

	});
}

export {Goals};