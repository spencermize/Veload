
import { TinyColor } from '@ctrl/tinycolor';
import { mostReadable } from '@ctrl/tinycolor';
function PhotoRefresher() {
	var i;
	$(document).on("pause.veload",function(f){
		clearInterval(i);
	});

	$(document).on("start.veload",function(){
		var radius = 1;
		i = setInterval(function () {
			radius = updatePhoto(radius);
		}, 15000);

	})
	$(document).on("backgroundUpdated.veload",function(){
		var el = $('.bg.blurrer');
		var c = el.data('color');
		var col = {r: c[0], g: c[1], b: c[2]}
		var domCol = new TinyColor(col);
		var newCol = domCol.tint(70).setAlpha(.9);
		var darkerCol = domCol.shade(30).saturate(30);
		var darkCol = darkerCol.shade(60).saturate(70).brighten(40);
		var readable = mostReadable(newCol,["#fff","#000",domCol,darkCol,darkerCol])
		
		V.opts.colors.MAINBG = newCol.toRgbString();
		V.opts.colors.MAINTXT = readable.toRgbString();
		V.opts.colors.DARK = darkCol.toRgbString();		
		V.opts.colors.DARKER = darkerCol.toRgbString();
		
		V.setColors();
	});
}
function updatePhoto(radius){
	var url;
	if(V.points.length){
		var l = _.last(V.points);
		url = `${V.opts.urls.remote.photos}?lat=${l.lat}&lon=${l.lng}&radius=${radius}`;
	}else{
		url = `${V.opts.urls.remote.photosRandom}/public`;
	}
	$.get(url, function (data) {
		var url = data.url;
		if (url && `url("${url}")` != $('.bg.blurrer').css('background-image')) {
			$('<img/>').attr('src', url).on('load', function () {
				$(this).remove();
				var el = $('.bg.blurrer').first();
				var el2 = $("<span class='bg blurrer' />");
				el.before(el2);
				el2.css({ 'background-image': `url(${url})` }).addClass('in').data('color',data.color);
				el.removeClass('in');
				$(document).trigger('backgroundUpdated.veload');				
				setTimeout(function () { 
					el.remove(); 
				}, 500);
			});
		}else{
			radius = radius * 2;
		}
	})
	return radius;
}

export {PhotoRefresher,updatePhoto};