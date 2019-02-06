import _ from 'lodash';
import interact from 'interactjs';
import Muuri from 'muuri';

var Goals = {};
Goals.show = function(){
	V.loading();
	var comp = self.cTemps.goals(V.user);
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

	$('#modal-container').one('shown.bs.modal', '#modal', function () {
		var fullGrid = $('.goals-container');
		var availY = fullGrid.height();
		var availX = fullGrid.width();
		var vari,max,min,unit,increment,minutes,totalX;

		var grid = new Muuri('.goals-grid', {
			layout: {
				horizontal: true,
				alignBottom: true,
				rounding: true
			}
		});
		fullGrid.data('grid',grid);
		Goals.addGoal(true);

		interact('.item', {
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
					restriction: '.goals-container'
				},
				snap: {
					endOnly: true
				}
			})
			.on('resizestart', function () {
				vari = $('.veload-goals .variable').find(":selected");
				max = vari.data("max");
				min = vari.data("min");
				unit = vari.data("unit");
				increment = 1;
				minutes = 60;
				totalX = (60 / increment) * minutes;
			})
			.on('resizemove', function (e) {
				var target = $(e.target);
				var targetContent = target.find(".item-content");
				var percentY = e.rect.height / availY;
				var percentX = e.rect.width / availX;
				var absY = Number(((max - min) * percentY) + min).toFixed(vari.data("decimal"));
				var absX = Number((totalX * percentX) / 60).toFixed(2);
				var absXMinutes = Math.ceil(absX) > 0 ? Math.ceil(absX) + " min" : "1 min";
				//var absXSeconds = (Math.round((absX % 1 * 60) / 15) * 15) + " seconds";
				// update the element's style
				var transform = target[0].style.transform.replace(/(translateY\()(-?\d+(?=px))/, `$1-${Math.floor(e.rect.height)}`);

				target.css({ "width": e.rect.width + 'px', "height": e.rect.height + 'px', 'transform': transform }).addClass('resizing');
				var msg = `${absY} ${unit} for ${absXMinutes}`
				targetContent.closest(".item").attr("title", msg);
				target.tooltip({animation:false});
				target.tooltip('hide');
				target.attr('data-original-title', msg).tooltip("show");

				if (e.dx != 0 && e.dy === 0) {
					Goals.refresh(target[0]);
				}
			}).on('resizeend', function (e) {
				$(e.target).removeClass('resizing');
				Goals.refresh(e.target);
			})

	});
}
Goals.removeGoal = function(e){
	$(e).closest(".item").remove();
	this.refresh();
}
Goals.addGoal = function(first){
	var temp =$('.goal-item-template').clone().removeClass('d-none').children()
	if(first===true){
		temp.find('.closer').addClass("d-none");
	}
	$('.goals-container').data('grid').add(temp[0])

}
Goals.refresh = function(item){
	var g = $('.goals-container').data('grid');
	if(g){
		var i = item || null;
		$('.goals-container').data('grid').refreshItems(i).layout();
	}
}

export { Goals };