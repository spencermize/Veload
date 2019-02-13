console.log("trying to load map...");
	
function Maps(){
	$(document).one(`modulesLoaded.veload`,function(e){
		init();
	});
	$(document).trigger("initialized.maps");
//	if (!(this instanceof Maps)) return new Maps(opts);
}
function init(){
	V.createMap();
	V.updateMap();	
}
V.getMap = function(){
	return $('.map').data("map");
}
V.createMap = function(){
	console.log('create map');
	var el = $('.map');
	el.data("map",L.map(el[0],{
		zoom: 9,
		center: [51.505, -0.09],
		attributionControl: false
	}));	
	/*L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=9550bf2f19b74edfbf935882be6d687e', {

	}).addTo(V.getMap());	*/
	L.tileLayer.provider('CartoDB.Positron').addTo(V.getMap());
}

V.updateMap = function(){
	$(document).on('locationUpdated.veload',function(){
		var l = V.points[V.points.length - 1]
		V.getMap().flyTo(l,16,{
			animate: false
		});
		V.myIcon.setLatLng(l);
	});
	$(document).on('gridItemResized.maps,gridResized.veload',function(){
		console.log('redrawing map');
		V.getMap().invalidateSize();
	});
	$(document).on('clear.veload',function(){
		V.getMap().remove();
		init();
	});
}

V.loadGPX = function(url){
	var V = this;
	var om = omni.gpx(url);
	V.points = [];
	om.on('ready', function(e) {
		var route = om.toGeoJSON().features[0].geometry.coordinates;
		var gpx = e.target
		var distance = 0;
		var bearing = 0;
		V.getMap().fitBounds(gpx.getBounds());
		console.log(route);
		for(coord = 0; coord<route.length-1;coord++){
			var s = route[coord];
			var f = route[coord+1];
			var sl = {lat: s[1], lng: s[0]};
			var fl = {lat: f[1], lng: f[0]};
			V.rTrail.push({distance: distance, bearing: bearing, latlng: {lat:sl.lat,lng:sl.lng}});

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
	V.unpop();
}
V.pickTrackGUI = function(){
	var item = $('[data-module="map"] .search-wrap ul.list').cleanWhitespace().html();
	var options = {
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
	V.loading();
	$.getJSON(V.opts.urls.remote.athleteRoutes,function(routes){
		$.getJSON(V.opts.urls.remote.athleteActivities,function(activities){
			var data = routes.concat(activities);
				var config = {
				title: 'Please choose a Strava Route or Activity',
				accept: false,
				body: $('[data-name="maps"] .search-wrap').html()
			}
			V.unpop();
			V.pop(config);
			$('#modal .searcher').attr("id","searchme");
			var list = new List("searchme",options);
			list.clear();

			//add each item to modal
			data.forEach(function(el){
				if(el.map.summary_polyline){
					var type;
					var dist = numeral(geolib.convertUnit('mi',el.distance)).format(Veload.MPHFORM);
					var desc;
					if(el.type == "Run" || el.type == "Bike"){
						var avg = numeral(el.average_speed).format(Veload.MPHFORM)
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