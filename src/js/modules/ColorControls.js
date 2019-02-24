import { TinyColor } from '@ctrl/tinycolor';
function setColors(){
	$('#color-overrides').remove();
	$('body').append(V.cTemps.colorOverrides(V.opts.colors));

	var chart = $('.grid-item:has([data-chart=line])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart')
		if(c){c.update();}
	})
	chart = $('.grid-item:has([data-chart=gauge])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart')
		var bg = [];
		var col = new TinyColor(V.opts.colors.DARK);
		for(var i = 0;i<100;i++){
			bg.push(col.setAlpha(i/100).toRgbString());
		}
		c.data.datasets[0].backgroundColor = bg;
		c.data.datasets[0].gaugeData.valueColor = V.opts.colors.DARK
		if(c){c.update();}
	})	
}

export {setColors};