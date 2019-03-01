import { TinyColor } from '@ctrl/tinycolor';
import Options from './Options.js';
import Templates from './Templates.js';

export default function setColors(){
	$('#color-overrides').remove();
	$('body').append(Templates.get('colorOverrides')(Options.colors));

	var chart = $('.grid-item:has([data-chart=line])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart');
		if (c){ c.update(); }
	});
	chart = $('.grid-item:has([data-chart=gauge])');
	chart.each(function(_i,ch){
		var c = $(ch).data('chart');
		if (c){
			var bg = [];
			var col = new TinyColor(Options.colors.DARK);
			for (var i = 0; i < 100; i++){
				bg.push(col.setAlpha(i / 100).toRgbString());
			}
			c.data.datasets[0].backgroundColor = bg;
			c.data.datasets[0].gaugeData.valueColor = Options.colors.DARK;
			c.update();
		}
	});
}
