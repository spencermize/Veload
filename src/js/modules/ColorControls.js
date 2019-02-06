function setColors(){
	$('#color-overrides').remove();
	$('body').append(V.cTemps.colorOverrides(V.opts.colors));


	Chart.defaults.global.defaultColor = V.opts.colors.MAINTXT;		
	var chart = $('.grid-item:has([data-chart])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart')
		if(c){c.update();}
	})
}

export {setColors};