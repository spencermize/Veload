import Options from './Options.js';
import { TinyColor,mostReadable } from '@ctrl/tinycolor';
import setColors from './ColorControls.js';
import _ from 'lodash';

var refreshReference = null;

const PhotoRefresher = {
	handleEvents: function(){
		var self = this;
		$(document).on('pause.veload',function(){
			clearInterval(refreshReference);
		});

		$(document).on('start.veload',function(){
			var radius = 1;
			refreshReference = setInterval(function(){
				radius = self.updatePhoto(radius);
			},15000);
		});
		$(document).on('backgroundUpdated.veload',function(){
			var el = $('.bg.blurrer');
			var c = el.data('color');
			var col = { r: c[0],g: c[1],b: c[2] };
			var domCol = new TinyColor(col);
			var newCol = domCol.tint(70).setAlpha(0.9);
			var darkerCol = domCol.shade(30).saturate(30);
			var darkCol = darkerCol.shade(60).saturate(70).brighten(40);
			var readable = mostReadable(newCol,['#fff','#000',domCol,darkCol,darkerCol]);

			if (V){
				Options.colors.MAINBG = newCol.toRgbString();
				Options.colors.MAINTXT = readable.toRgbString();
				Options.colors.DARK = darkCol.toRgbString();
				Options.colors.DARKER = darkerCol.toRgbString();
			}

			setColors();
		});
	},
	updatePhoto: async function(radius){
		var url;
		if (typeof V !== 'undefined' && V.points.length){
			var l = _.last(V.points);
			url = `${Options.urls.remote.photos}/${l.lat}/${l.lng}/${radius}/public`;
		} else {
			url = `${Options.urls.remote.photosRandom}/public`;
		}
		$.get(url,function(data){
			var url = data.url;
			if (url && `url("${url}")` != $('.bg.blurrer').css('background-image')){
				$('<img/>').attr('src',url).on('load',function(){
					$(this).remove();
					var el = $('.bg.blurrer').first();
					var el2 = $("<span class='bg blurrer' />");
					el.before(el2);
					el2.css({ 'background-image': `url(${url})` }).addClass('in').data('color',data.color);
					el.removeClass('in');
					$(document).trigger('backgroundUpdated.veload');
					setTimeout(function(){
						el.remove();
					},500);
				});
			} else {
				radius = radius * 2;
			}
		});
		return radius;
	}
};

PhotoRefresher.handleEvents();
PhotoRefresher.updatePhoto();

Object.freeze(PhotoRefresher);

export default PhotoRefresher;
