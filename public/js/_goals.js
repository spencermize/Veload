document.addEventListener('veloaded',function(){
	Veload.prototype.goals = function(){
		var self = this;
		$(document).trigger('goalsLoaded');
	}
	$(document).trigger('goalsModuleLoaded');
});