function Maps(){
	$(document).one(`modulesLoaded.veload`,function(e){
		init();
	});
	$(document).trigger("initialized.maps");
}
function init(){
	V.createMap();
	V.updateMap();	
}
V.getMap = function(){
	return $('.map').data("map");
}
V.createMap = function(){
	var el = $('.map');
	el.data("map",L.map(el[0],{
		zoom: 9,
		center: [51.505, -0.09],
		attributionControl: false
	}));	
	L.tileLayer.provider('CartoDB.Positron').addTo(V.getMap());
}

V.updateMap = function(){
	$(document).on('locationUpdated.veload',function(){
		var l = V.points[V.points.length - 1]
		V.getMap().flyTo(l,14,{
			animate: false
		});
		V.myIcon.setLatLng(l);
	});
	$(document).on('gridItemResized.maps gridResized.veload',function(){
		V.getMap().invalidateSize();
	});
	$(document).on('clear.veload',function(){
		V.getMap().remove();
		init();
	});
}

V.loadGPX = function(url){
	V.unpop();
	V.loading();
	$(document).trigger("trackLoading.veload");
	var om = omni.gpx(url);
	V.points = [];
	om.on('ready', function(e) {
		var route = om.toGeoJSON().features[0].geometry.coordinates;
		var gpx = e.target
		var distance = 0;
		var bearing = 0;
		V.getMap().fitBounds(gpx.getBounds());
		for(coord = 0; coord<route.length-1;coord++){
			var s = route[coord];
			var f = route[coord+1];
			var sl = {lat: s[1], lng: s[0]};
			var fl = {lat: f[1], lng: f[0]};
			V.rTrail.push({distance: distance, bearing: bearing, latitude: sl.lat, longitude: sl.lng, latlng: {lat:sl.lat,lng:sl.lng}});

			//distance remaining from previous waypoint. first waypoint should be zero
			distance = geolib.getDistance(sl,fl,1,15);
			bearing = geolib.getBearing(sl,fl);
		}
		var l = new Point(V.rTrail[0].latlng.lat,V.rTrail[0].latlng.lng)
		V.points.push(l);

		var pulsingIcon = L.icon.pulse({
			iconSize:[20,20],
			color: V.opts.colors.GOOD,
			fillColor: V.opts.colors.GOOD
		});
		V.myIcon = L.marker([l.lat,l.lng],{icon: pulsingIcon,opacity:.8}).addTo(V.getMap());
		$(document).trigger("trackLoaded.veload");
	}).on('error',function(e){
		V.error(e);
	}).addTo(V.getMap());		
}
V.loadTrack = function(e){
	V.loadGPX(e.closest("[data-ref]").data("ref"));
}
V.pickTrackGUI = function(){
	var config = {
		title: 'Route Selection',
		accept: false,
		body: $('.StravaOrRide').html()
	}
	V.unpop();
	V.pop(config);	
}
V.gpsLoader = function(){
	var options = V.listOptions()
	V.unpop();
	var html = $('.rwgpsSearch').html() + $('.search-wrap').html()
	V.pop(V.listModalOptions(html));
	$('#modal .searcher').attr("id","searchme");
	var list = new List("searchme",options);
	$('#modal').data("list",list);
	list.clear();	

}
V.gpsSearch = function(){
	var kw = $('#modal .gpsSearchKeywords');
	var di = $('#modal .gpsSearchDistance');
	var keywords = kw.val();
	var distance = di.val();

	kw.toggleClass("is-invalid",!keywords.length);
	di.toggleClass("is-invalid",!distance.length);

	if(keywords.length && distance.length){
		var list = $('#modal').data("list");		
		list.clear();
		$('#searchme .list').loader();
		$.getJSON(`${V.opts.urls.remote.rwgpsRouteSearch}?keywords=${keywords}&distance=${distance}`,function(routes){
			$('#searchme .list').empty();
			routes.results.forEach(function(e){
				var el = e[e.type];
				el.distance = el.distance / 1000;
				if(V.user.units=="miles"){
					el.distance = el.distance / 1.609;
				}
				list.add({
					name: el.name,
					timestamp: el.created_at,
					days: moment(el.created_at).fromNow(), 
					description:`${el.short_location} - ${Number(el.distance).toFixed(2)} ${V.user.units}`, 
					ref:`/api/rwgpsRouteGPX/${el.id}/${e.type}s`
				});
			})
		})
	}

}
V.listOptions = function(){
	var item = $('.search-wrap ul.list').cleanWhitespace().html();
	return {
		valueNames: [
			'name',
			'days',
			'description',
			{ 'data':['ref','timestamp']}
		],
		item: item,
		page: 5,
		pagination: true
	}
}
V.listModalOptions = function(body){
	return {
		title: 'Route Selection',
		accept: false,
		body: body
	}
}
V.stravaLoader = function(){
	var options = V.listOptions()
	V.loading();
	$.getJSON(V.opts.urls.remote.athleteRoutes,function(routes){
		$.getJSON(V.opts.urls.remote.athleteActivities,function(activities){
			var data = routes.concat(activities);
			V.unpop();
			V.pop(V.listModalOptions($('.search-wrap').html()));
			$('#modal .searcher').attr("id","searchme");
			var list = new List("searchme",options);
			list.clear();

			//add each item to modal
			data.forEach(function(el){
				if(el.map.summary_polyline){
					var type;
					var dist = Number(geolib.convertUnit('mi',el.distance)).toFixed(2);
					var desc;
					if(el.type == "Run" || el.type == "Bike"){
						var avg = Number(el.average_speed).toFixed(2)
						type = "activities";
						created = el.start_date;
						desc = `You averaged ${avg} mph and traveled ${dist} miles.`;
					}else if(el.type==1){
						type = "routes";
						created = el.created_at;
						desc = `You own this ${dist} mile route.`;
					}else{
						type = false;
					}
					if(type){
						var days = moment(created).fromNow();
						list.add({
							name: el.name,
							timestamp: created,
							days: days, 
							description:desc, 
							ref:`/api/${type}GPX/${el.id}`
						});
					}
				}
			});
		})
	});
}

$(document).trigger("moduleLoaded.maps");