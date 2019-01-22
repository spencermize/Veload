Veload.prototype.photoRefresher: function(){
	var radius = .5;
	return setInterval(function(){
		const maxResults = 50;
		$.getJSON(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=f01b5e40d794a63ebd9b51fd4eb985ab&lat=${currLoc.lat}&lon=${currLoc.lng}&format=json&extras=url_o,url_k,url_h&radius=${radius}&per_page=${maxResults}&tags=beautiful,pretty,sunset,sunrise,architecture,landscape,building,outdoors,trail,travel&sort=interestingness-desc&content_type=1&nojsoncallback=1,has_geo=true`,function(data){
			var url = "";
			if(data.photos.total>0){
				var attempts = 0;
				if(data.photos.total < 20){
					radius = radius * 2;
				}
				while(!url && attempts < (data.photos.photo.length)){
					const p = data.photos.photo[Math.floor(Math.random() * (data.photos.photo.length-1))];
					url = p.url_o ? p.url_o : p.url_k;
					console.log('attempting...' + url);
					attempts++;
				}
				if(!url){
					radius = radius * 2;
					url = data.photos.photo[0].url_h;
				}					
				if(url && `url("${url}")` != $('.bg.blurrer').css('background-image')){
					$('<img/>').attr('src', url).on('load', function() {
						$(this).remove(); // prevent memory leaks as @benweet suggested
						var el1 = $('.bg.blurrer').addClass("curr");
						el1.before("<span class='bg blurrer' />");
						var el2 = $('.bg.blurrer:not(.curr)');
						el2.css({'background-image':`url(${url})`});
						el2.addClass('in');
						$('.bg.blurrer.curr').removeClass('in');
						setTimeout(function(){$('.bg.blurrer.curr').remove();},2000);
					});
				}
			}else{
				radius = radius * 2;
			}
		});
	},15000);
}