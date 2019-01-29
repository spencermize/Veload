
import { TinyColor } from '@ctrl/tinycolor';
import { mostReadable } from '@ctrl/tinycolor';
function PhotoRefresher() {
	var radius = .5;
	const maxResults = 50;
	var i;
	
	$(document).on("pause.veload",function(f){
		clearInterval(i);
	});

	$(document).on("start.veload",function(){
		var radius = 1;
		i = setInterval(function () {
            var l = _.last(V.points);
			$.get(`${V.opts.urls.remote.photos}?lat=${l.lat}&lon=${l.lng}&format=json&extras=url_o,url_k,url_h&radius=${radius}&per_page=${maxResults}&tags=beautiful,pretty,sunset,sunrise,architecture,landscape,building,outdoors,trail,travel&sort=interestingness-desc&content_type=1&nojsoncallback=1,has_geo=true`, function (data) {
				var url = data.url;
				if (url && `url("${url}")` != $('.bg.blurrer').css('background-image')) {
					$('<img/>').attr('src', url).on('load', function () {
						$(this).remove();
						var el1 = $('.bg.blurrer').addClass("curr");
						el1.before("<span class='bg blurrer' />");
						var el2 = $('.bg.blurrer:not(.curr)');
						el2.css({ 'background-image': `url(${url})` });
						el2.addClass('in').data('color',data.color);
						$('.bg.blurrer.curr').removeClass('in');
						$(document).trigger('backgroundUpdated.veload');
						setTimeout(function () { $('.bg.blurrer.curr').remove(); }, 2000);
					});
				}else{
					radius = radius * 2;
				}
			});
		}, 15000);

	})
	$(document).on("backgroundUpdated.veload",function(){
		var el = $('.bg.blurrer.in');
		var c = el.data('color');
		var col = {r: c[0], g: c[1], b: c[2]}
		var domCol = new TinyColor(col);
		var newCol = domCol.lighten(30).desaturate(10).setAlpha(.9);
		var darkCol = domCol.darken(50);
		var readable = mostReadable(newCol,["#fff","#000",domCol,darkCol]).toHexString()
		$('.card-body,.navbar')
			.css('background-color',newCol.toRgbString())
			.css('color',readable);
		
		Chart.defaults.global.defaultColor = readable;
		var chart = $('.grid-item:has([data-chart])');
		chart.each(function(_i,ch){
			var c = $(ch).data('chart')
			c.options.scales.yAxes[0].gridLines.color = darkCol;
			c.update();
		})
		$('.navbar .btn[class^="btn-outline"]').css({'color':readable,'border-color':readable});
	});
}

export {PhotoRefresher};