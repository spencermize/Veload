console.log("trying to load map...");
Veload.prototype.maps = function(){
	var self = this;
	$(document).one(`modulesLoaded.veload`,function(e){
		createMap()
		navigator.geolocation.getCurrentPosition(function(position) {
			getMap().panTo([position.coords.latitude,position.coords.longitude]);
			self.currLoc = {lat:position.coords.latitude,lng:position.coords.longitude};
		});		
		Leaflet.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=9550bf2f19b74edfbf935882be6d687e', {

		}).addTo(getMap());
		$(document).on('locationUpdated.veload',function(){
			getMap().flyTo(self.currLoc,18);
		});
		$(document).on('gridItemResized.maps',function(){
			console.log('redrawing map');
			getMap().invalidateSize();
		});
	});
	$(document).trigger("initialized.maps");
}
Veload.prototype.loadGPX = function(url){
	var om = omni.gpx(url);
	var self = this;
	om.on('ready', function(e) {
		self.route = om.toGeoJSON().features[0].geometry.coordinates;
		var gpx = e.target
		getMap().fitBounds(gpx.getBounds());
		for(coord = 0; coord<self.route.length-1;coord++){
			var s = self.route[coord];
			var f = self.route[coord+1];
			var sl = {lat: s[1], lng: s[0]};
			var fl = {lat: f[1], lng: f[0]};
			var d = geolib.getDistance(sl,fl,1,1);
			var b = geolib.getBearing(sl,fl);
			self.rTrail.push({distance: d, bearing: b, latlng: {lat:sl.lat,lng:sl.lng}});
		}
		self.currLoc = self.rTrail[0].latlng;

		var pulsingIcon = Leaflet.icon.pulse({
			iconSize:[20,20],
			color: self.GOOD,
			fillColor: self.GOOD
		});
		self.myIcon = Leaflet.marker([self.currLoc.lat,self.currLoc.lng],{icon: pulsingIcon,opacity:.8}).addTo(getMap());
	}).on('error',function(e){
		self.error(e);
	}).addTo(getMap());		
}
Veload.prototype.loadTrack = function(e){
	self.loadGPX(e.closest("[data-ref]").data("ref"));
	self.unpop();
}
Veload.prototype.pickTrackGUI = function(){
	var self = this;

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
	self.loading();
	$.getJSON(self.remote.athleteRoutes,function(routes){
		$.getJSON(self.remote.athleteActivities,function(activities){
			var data = routes.concat(activities);
				var config = {
				title: 'Please choose a Strava Route or Activity',
				accept: false,
				body: $('[data-name="maps"] .search-wrap').html()
			}
			self.unpop();
			self.pop(config);
			$('#modal .searcher').attr("id","searchme");
			var list = new List("searchme",options);
			list.clear();

			data.forEach(function(el){
				if(el.map.summary_polyline){
					var type;
					var dist = numeral(geolib.convertUnit('mi',el.distance)).format(Veload.MPHFORM);
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
	
function getMap(){
	return $('.map').data("map");
}
function createMap(){
	console.log('create map');
	var el = $('.map');
	el.data("map",Leaflet.map(el[0],{
		zoom: 9,
		center: [51.505, -0.09],
		attributionControl: false
	}));	
}
$(document).trigger("moduleLoaded.maps");